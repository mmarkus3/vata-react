/* eslint-disable max-len */
export function getGeneralTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kiira.app ilmoitus</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #fff;
  }
  table {
    width: 100%;
  }
  th {
    text-align: left;
  }
  .logo {
    text-align: center;
  }
  .logo img {
    width: 50px;
    padding-bottom: 50px;
  }
  .bold {
    font-weight: bolder;
  }
  .field {
    background: #f7f7f7;
    padding: 8px 20px;
  }
  .email-container {
    max-width: 500px;
    margin: auto;
    background-color: #ffffff;
    padding: 60px 20px;
  }
  .email-content {
    font-size: 16px; /* Base font size */
    line-height: 1.5;
  }
  .email-content img {
    max-width: 500px;
    padding: 50px 0px 20px 0px;
  }
  .header-1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .header-3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .footer {
    font-size: 14px;
    color: #888888;
    margin-top: 20px;
  }
  @media screen and (max-width: 480px) {
    .email-content, .header-1, .header-3, .footer {
      font-size: 14px;
    }
  }
</style>
</head>
<body>
<div class="email-container">
    <div class="logo"><img src="https://firebasestorage.googleapis.com/v0/b/vata-app-b0114.appspot.com/o/public%2Flogo%2Ffinnut.png?alt=media&token=8b7a593b-c054-49be-94f0-83bd4b83ecb6" alt="Logo" /></div>
  <div class="email-content">
    <h3 class="header-3">Tilaus</h3>
    <h1 class="header-1">${title}</h1>
    <p>
        ${body}
    </p>

    <p class="footer">Finnut</p>
  </div>
</div>
</body>
</html>`;
}
