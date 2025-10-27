import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:5050/api";
    static ENCRYPTION_KEY = "abcdefghi1234567890abcdefghi1234567890"

    //encrypt data using crypto
    static encrypt(data) {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
    }

    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY)
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    //Save token with encryption
    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken)
    }

    //Retrieve token with encryption
    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    //Save Role with encryption
    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole)
    }

    //Retrieve Role with encryption
    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role")
    }

    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    /** AUTH && USERS API */
    static async registerUser(registerData) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData)
        return response.data;
    }

    static async loginUser(loginData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData)
        return response.data;
    }

    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/users/current`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async updateUser(userId, userData) {
        const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, userData, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/update/${userId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }


    /**AUTHENTICATION CHECKER **/
    static logout() {
        this.clearAuth()
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static isAdmin() {
        const role = this.getRole();
        return role === "ADMIN";
    }

    /**PRODUCT ENDPOINT */
    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/products/add`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/products/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/products/all`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async searchProduct(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/products/search`, {
            params: { searchValue },
            headers: this.getHeader()
        })
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/products/delete/${productId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getImage(fileName) {
        if (!fileName) return "https://via.placeholder.com/200";

        const response = await axios.get(`${this.BASE_URL}/images/${encodeURIComponent(fileName)}`, {
            headers: this.getHeader(),
            responseType: "blob" // important for images
        });

        return URL.createObjectURL(response.data); // Convert blob to usable URL
    }

    /**CATEGORY ENDPOINTS **/
    static async addCategory(formData) {
        const response = await axios.post(`${this.BASE_URL}/categories/add`, formData, {
            headers: this.getHeader(),
        })
        return response.data;
    }

    static async updateCategory(categoryId, formData) {
        const response = await axios.put(`${this.BASE_URL}/categories/update/${categoryId}`, formData, {
            headers: this.getHeader(),

        })
        return response.data;
    }

    static async getAllCategories() {
        const response = await axios.get(`${this.BASE_URL}/categories/all`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/categories/${categoryId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }



    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/categories/delete/${categoryId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    /**SUPPLIER ENDPOINTS **/
    static async addSupplier(formData) {
        const response = await axios.post(`${this.BASE_URL}/suppliers/add`, formData, {
            headers: this.getHeader(),
        })
        return response.data;
    }

    static async updateSupplier(supplierId, formData) {
        const response = await axios.put(`${this.BASE_URL}/suppliers/update/${supplierId}`, formData, {
            headers: this.getHeader(),

        })
        return response.data;
    }

    static async getAllSuppliers() {
        const response = await axios.get(`${this.BASE_URL}/suppliers/all`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getSupplierById(supplierId) {
        const response = await axios.get(`${this.BASE_URL}/suppliers/${supplierId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }



    static async deleteSupplier(supplierId) {
        const response = await axios.delete(`${this.BASE_URL}/suppliers/delete/${supplierId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }


    /**TRANSACTION ENDPOINTS **/
    static async purchase(formData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/purchase`, formData, {
            headers: this.getHeader(),
        })
        return response.data;
    }

    static async sell(formData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/sell`, formData, {
            headers: this.getHeader(),
        })
        return response.data;
    }

    static async return(formData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/return`, formData, {
            headers: this.getHeader(),
        })
        return response.data;
    }

    static async updateTransaction(transactionId, status) {
        const response = await axios.put(`${this.BASE_URL}/transactions/update/${transactionId}`, status, {
            headers: this.getHeader(),

        })
        return response.data;
    }

    static async getAllTransactions(filter) {
        const response = await axios.get(`${this.BASE_URL}/transactions/all`, {
            headers: this.getHeader(),
            params: { filter }
        })
        return response.data;
    }

    static async getTransactionByMonthAndDate(month, year) {
        const response = await axios.get(`${this.BASE_URL}/transactions/bydate`, {
            headers: this.getHeader(),
            params: {
                month: month,
                year: year
            }
        })
        return response.data;
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${this.BASE_URL}/suppliers/${transactionId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }





}