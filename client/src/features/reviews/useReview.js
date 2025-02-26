
import axios from 'axios';

export const postReview = async(reviewData) =>{
    const response = await axios.post('',reviewData);
    return response.data
   
}