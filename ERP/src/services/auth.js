


export const loginUser = async (formdata) => {
 
  try{

    const res = await fetch('http://localhost:5000/login', {
    method: 'POST',
    credentials: "include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata)

  });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('loggedIn', data.loggedIn); // simple token storage
    return data;
  }catch(err){
    console.error(err);
  }

};



export const registerUser = async (email, password) => {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Signup failed');
  return await res.json();
};


export const logoutUser = () => {
  localStorage.removeItem('loggedIn');
};


export const updateModule   = async (moduleData) => {   

    
}

export const getModules = async () => {
        
};

export const checkAuth = async () => {
  const token = localStorage.getItem('loggedIn');
  const user = token ? token : null;
  return user;
};