document.addEventListener('DOMContentLoaded', function() {

  // Ids from button in inbox.html, to change between views, load_mailbox -> from views.py
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Once click submit button sent email to someone
  // look for compose-form, once event submit happens, send_email
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox.html ? 
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose-view div and hide emails-view div from inbox.html
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Clear out composition fields, zum Erstellen einer Mail
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
 
function view_email(id){
// will get only emails with specific id and display the div - email-detail-view
fetch(`/emails/${id}`)
.then(response => response.json())
// we give the name for variable "email",
.then(email => {
    // Print email
    console.log(email);

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'block';

    document.querySelector('#email-detail-view').innerHTML = `
    <ul class="list-group">
      <li class="list-group-item"><strong>From: </strong> ${email.sender}</li>
      <li class="list-group-item"><strong>To: </strong> ${email.recipients}</li>
      <li class="list-group-item"><strong>Subject: </strong> ${email.subject}</li>
      <li class="list-group-item"><strong>Timestamp: </strong> ${email.timestamp}</li>
      <li class="list-group-item">${email.body}</li>
    </ul>
    `
    // if email was not read now, get the email and chage status of read to true 
    if(!email.read)
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
          })
      })
      // Archive / Unarchive Logic
      const btn_arch = document.createElement('button');
      btn_arch.innerHTML = email.archived ? "Unarchive" : "Archive";
      btn_arch.className = email.archived ? "btn btn-success" : "btn btn-danger";
      btn_arch.addEventListener('click', function() {
        // will change the status for us every time we click the button trough !email.archived 
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email.archived
          })
        })
        // call .then and trigger function to be redirected to archive website
        .then(() => {load_mailbox ('archive')})
      });
      document.querySelector('#email-detail-view').append(btn_arch);

      //Reply logic
      const btn_reply = document.createElement('button');
      // innerHTML -what will be written on the button
      btn_reply.innerHTML =  "Reply";
      btn_reply.className =  "btn btn-info";
      btn_reply.addEventListener('click', function() {

        // when we click on relpy button will show reply in console, then we know buttonn is working 
        //console.log("Reply");
        // Function from views.py
        compose_email();

        document.querySelector('#compose-recipients').value = email.sender;
        let subject = email.subject;
        // If first part of the subject is nor Re
        if(subject.split(' ',1)[0] !="Re:"){
          // Do the function and set subject to Re + email , we overwrite it 
          subject = "Re: " + email.subject;
        }
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote ${email.body}`;
      
      });
      document.querySelector('#email-detail-view').append(btn_reply);
  });
}

//load_mailbox expecting a variable ,mailbox is function in views.py -> inbox,  compose send or archive
function load_mailbox(mailbox) {
  
  // Show the mailbox, the emails-view div and hide compose-view div, the form to compose emails / views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get the emails for that maibox , could be for inbox, compose send or archive
  // put name of a variable -> ${mailbox}` 
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    //Loop through emails and create a div for each 
    // we give the name for variable "singleEmail", will change in every iteration of the loops
    //checks every time a new emal for those deatails
    emails.forEach(singleEmail => {
      // Print -> we get as result of email, should show us the emails we have sent
      console.log(singleEmail);

      //Create div for each email
      const newEmail = document.createElement('div');
      newEmail.className = "border border-dark";
      newEmail.innerHTML = `
      <h6>Sender: ${singleEmail.sender}</h6>
      <h5>Subject: ${singleEmail.subject}</h5>
      <p>${singleEmail.timestamp}</p>
      `;

      // check if email read, if yes, class from styles.css read otherwise unread
      newEmail.className = singleEmail.read ? 'read' : 'unread';
      // Add click event to email
      newEmail.addEventListener('click', function () {
        view_email(singleEmail.id)
      });

      // we append the new element to the emails view
      document.querySelector('#emails-view').append(newEmail);
    })
});
}

// like a get request..
function send_email(event){
  event.preventDefault();

  //Store fields that user types in 
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //Send data to backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}