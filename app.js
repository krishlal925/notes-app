const userContainer = document.querySelector('#user-info')
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
  console.log("im here")
  console.log(userContainer);
  userContainer.innerHTML = `
  <div><h5>${user.fullName}</h5></div>
  <img class= "rounded-circle z-depth-2" src = ${user.avatar}>
  <div> ${user.bio}</div>
  `
}

function displayNotes({data}){
  let notes = data.map(function(note){
    return `
    <li>${note.text}</li>
    `
  }).join()



  let notesList = document.querySelector('#notes-list');
  console.log(notes);
  notesList.innerHTML = notes;

}
startApp();

