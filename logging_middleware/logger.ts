export const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwcDI2MzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzU3MSwiaWF0IjoxNzc3NzAyNjcxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNTNkZmZkODEtYjU0MC00ZDk4LTgzZGUtNzQ2MjliNGEyY2QxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHJhZ3lhIHBhcmFtaXRhIHNhaG9vIiwic3ViIjoiMWExMGM4ZDQtOTlhNC00MTlmLWFlNDQtODFmYTc5MjI3YmEyIn0sImVtYWlsIjoicHAyNjM0QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoicHJhZ3lhIHBhcmFtaXRhIHNhaG9vIiwicm9sbE5vIjoicmEyMzExMDAzMDEwNzcwIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMWExMGM4ZDQtOTlhNC00MTlmLWFlNDQtODFmYTc5MjI3YmEyIiwiY2xpZW50U2VjcmV0IjoiTVFycXhzelVjZ3FITVdxeiJ9.UqP_oASE0XYGEaGMoONyY5qapnKLRsgi-ehx9-xxIwA";

  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message.toLowerCase(),
      }),
    });
    const data = await response.json();
    console.log("Log success:", data);
  } catch (err) {
    console.error("Log failed:", err);
  }
};
