import axios from 'axios';
const url = process.env.REACT_APP_FIREBASE_DATABASE_URL;

const instance = axios.create({
	baseURL: url
});

export default instance;