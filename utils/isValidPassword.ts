// utils/isValidPassword.ts

export default async function isValidPassword(inputPassword: string, storedHash: string, storedSalt: string): Promise<boolean> {
  try {
      // Decode the stored salt from Base64
      const salt = Buffer.from(storedSalt, "base64");

      // Concatenate the input password with the stored salt
      const combined = new TextEncoder().encode(inputPassword);
      const combinedWithSalt = new Uint8Array(combined.length + salt.length);
      combinedWithSalt.set(combined);
      combinedWithSalt.set(salt, combined.length);

      // Hash the combination of the input password and the stored salt
      const arrayBuffer = await crypto.subtle.digest("SHA-512", combinedWithSalt);

      // Encode the resulting hash to Base64
      const inputHash = Buffer.from(arrayBuffer).toString("base64");

      // Compare the input hash to the stored hash
      console.log(`Input password hash: ${inputHash}`);
      console.log(`Stored password hash: ${storedHash}`);

      return inputHash === storedHash; // Return true if hashes match, false otherwise
  } catch (error) {
      console.error('Error comparing password:', error);
      return false;
  }
}
