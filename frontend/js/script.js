// alert('js up')
const signInForm = document.getElementById('signin_form');
const url = 'http://127.0.0.1:8080/signin';

const handleSignIn = async (data) => {
    const res = await fetch(url, { method: "POST" , headers: { "Content-Type": "Application/json", "Origin": "*"}, mode: "cors", body: JSON.stringify(data)});
    console.log(res)
};

const handleSubmit = (event) => {
    event.preventDefault()
    const name = signInForm.name.value;
    const password = signInForm.password.value;
    const userData = { name, password };
    console.log(userData)
    handleSignIn(userData)
};

signInForm.addEventListener('submit', handleSubmit)