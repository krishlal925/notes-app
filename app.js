const userContainer = document.querySelector('#user-info')
const notesContainer =document.querySelector('#notes-list');
let user, notes;
const API = 'https://acme-users-api-rev.herokuapp.com/api';


//grab a user
const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId');
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);

  return  user;
};

//start the app
const startApp = async()=> {
  user = await fetchUser()

  console.log(user);
  createUserCard()
  const response = await axios.get(`${API}/users/${user.id}/notes`)
  displayNotes(response);
};

function createUserCard(){

  userContainer.innerHTML = `
  <div><h5>${user.fullName}</h5></div>
  <img class= "rounded-circle z-depth-2" src = ${user.avatar}>
  <div> ${user.bio}</div>
  `
}

function displayNotes({data}){
  let notes = data.map(function(note){
    return `
    <li>
    ${note.text}
    <button data-id='${note.id}'>x</button>
    </li>
    `
  }).join()

  notesContainer.innerHTML = notes;

}

async function createNote(event){
  let newNoteText = event.target.form[0].value;
  let newNote ={ text: newNoteText}
  const response = await axios.post(`${API}/users/${user.id}/notes`, newNote)
  startApp()

}
startApp();

let button = document.querySelector("#create-button")
button.addEventListener("click", createNote)

notesContainer.addEventListener("click", async (event)=>{
  console.log(event.target.getAttribute('data-id'))
  let id = event.target.getAttribute('data-id')

   await axios.delete(`${API}/users/${user.id}/notes/${id}`);
   startApp();
})

