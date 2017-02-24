import axios from 'axios';

export function signinUser({email, password}) {
    return function(dispatch) {
        axios.post('/api/signin', {email, password});
    }
}