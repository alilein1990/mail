document.addEventListener('DOMContentLoaded', function() {

  // Ids from button in inbox.html, to change between views, load_mailbox -> which specific one ..
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

  // Clear out composition fields, zum Erstellen einer Mail
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
 
//load_mailbox expecting a variable ,mailbox is function in views.py -> inbox compose send or archived 
function load_mailbox(mailbox) {
  
  // Show the mailbox, the emails-view div and hide compose-view div, the form to compose emails / views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get the emails for that maibox and user
  // put name of a variable -> ${mailbox}` 
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...
});

}

function send_email(event){
  event.preventDefault();
  // Store fields the user typed in
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send Data to backend
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
      // Loop through emails and create a div for each 
      ElementInternals.forEach(singleEmail => {
        
      })
  });

}