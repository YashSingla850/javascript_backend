class ApiResponse{
    constructor(statuCode , data, message = "Success"){
        thtis.statuCode = statuCode;
        this.data = data;
        this.message = message;
        this.success = statuCode<400
    }
}