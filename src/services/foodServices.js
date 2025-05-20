import axios from "axios";

const AXIOS_BASE_URL = 'http://localhost:8080/api/foods'



export const fetchFoodList = async () => {
    try {
        const response = await axios.get(AXIOS_BASE_URL)
        return (response.data);
    } catch (error) {
        console.log(error);
        throw error

    }
};

export const fetchFoodById = async (id) => {

    try {
        const response = await axios.get(`${AXIOS_BASE_URL}/${id}`);
        return response.data
    } catch (error) {
        console.log(error);
        throw error

    }
}