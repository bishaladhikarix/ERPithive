


export const loginUser = async (formdata) => {
 
  try{

    const res = await fetch('http://localhost:5000/user/login', {
    method: 'POST',
    credentials: "include",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata)

  });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('loggedIn', true); // simple token storage
    return data;
  }catch(err){
    console.error(err);
  }

};



export const registerUser = async (formdata) => {
  try{
    const res = await fetch('http://localhost:5000/user/signup', {
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


export const updateModule   = async (moduleData) => {   
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