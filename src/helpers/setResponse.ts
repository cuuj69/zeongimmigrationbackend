const setResponse = (statusCode: number, body: object) => {
  const response = {
    statusCode: statusCode,
    body: body,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return response;
};

export default setResponse;
