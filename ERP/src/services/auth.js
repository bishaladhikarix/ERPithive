


export const loginUser = async (formdata) => {
 
  try{
    console.log("Logging in with API URL:", import.meta.env.VITE_API_URL);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
    method: 'POST',
    credentials: "include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata)

  });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('loggedIn', true); // simple token storage
    localStorage.setItem('userEmail', formdata.email);
    return data;
  }catch(err){
    console.error(err);
  }

};



export const registerUser = async (formdata) => {
  try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
    method: 'POST',
    credentials: "include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata)
    });
    if (!res.ok) throw new Error('Signup failed');
    return await res.json();

  }catch(err){
    console.error(err);
  }

};


export const logoutUser = () => {
  localStorage.clear();
}


export const updateModule   = async (email,moduleData) => {   
// moduleData should be an object like {hr: true, inventory: false}
  try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/update-module`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email, moduleData})  
    });
    if (!res.ok) throw new Error('Failed to update modules');
    return await res.json();
  }catch(err){
      console.error(err);
  }   
  // try{

  //   const res = await fetch('http://localhost:5000/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(moduleData)

  // });
  //   if (!res.ok) throw new Error('Invalid credentials');
  //   const data = await res.json();
  //   localStorage.setItem('loggedIn', true); // simple token storage
  //   return data;
  // }catch(err){
  //   console.error(err);
  // }
    
}

export const getModules = async () => {
    try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email:localStorage.getItem("userEmail")})
    });
    if (!res.ok) throw new Error('Failed to fetch modules');
    return await res.json();
    }catch(err){
      console.error(err);
    }
};

// export const getModules = async () => {    
//     const res = await fetch('http://localhost:5000/modules')
//     if (!res.ok) throw new Error('Failed to fetch modules');
//     return await res.json();
// };

export const checkAuth = async () => {
  const token = localStorage.getItem('loggedIn');
  const user = token ? token : null;
  return user;
};