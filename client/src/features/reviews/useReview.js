
import axios from 'axios';

export const postReview = async(reviewData) =>{
    const response = await axios.post('http://localhost:5000/api/v1/reviews',reviewData);
    return response.data
   
}