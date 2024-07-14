import axios from 'axios'

const baseURL = "http://localhost:3001/api/persons"
// const baseURL = "https://phone-book-backend-h1p2.onrender.com/api/persons"
// const baseURL = "/api/persons"

const getAll = () =>{
    return axios.get(baseURL).then(response => {
        // console.log(response)
       return (response.data)
    })
}

const add = (newPerson) =>{
    return axios.post(baseURL,newPerson).then(response => response.data)
}

const del= (id) => {
    return axios.delete(`${baseURL}/${id}`).then(response => response.data)
}

const update = (id,newPerson) =>{
    return axios.put(`${baseURL}/${id}`,newPerson).then(respose =>respose.data)
}
export default { getAll,add,del,update }