const successMessage = { status: 'success' };
const errorMessage = { status: 'error' };
const status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
};

const trip_statuses = {
  active: 1.00,
  cancelled: 2.00,
}
const uploadSuccessMessage = { status: 'success' , message: "Arquivo lido e transferido para o servidor com sucesso!"};

module.exports =  {
  successMessage,
  errorMessage,
  status,
  trip_statuses,
  uploadSuccessMessage

};