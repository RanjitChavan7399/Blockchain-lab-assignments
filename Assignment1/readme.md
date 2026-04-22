# 📜 Certificate Verification Smart Contract

## 🔹 Contract Purpose

This smart contract is designed to store and verify student certificates on the blockchain.
It provides a secure and tamper-proof way to manage academic records without relying on a centralized authority.

By using blockchain technology, the certificates cannot be altered once stored, ensuring authenticity and trust. Anyone can verify a certificate using its unique ID.

---

## 🔹 Functions and Logic

### ✔ addCertificate()

* This function is used to add a new certificate to the blockchain.
* It takes the following inputs:

  * Certificate ID
  * Student Name
  * Course
  * Grade
* Only the admin (contract deployer) is allowed to add certificates.
* It checks if the certificate already exists to prevent duplication.
* Once added, the certificate data is permanently stored on the blockchain.

---

### ✔ verifyCertificate()

* This function is used to verify and retrieve certificate details.
* It takes the Certificate ID as input.
* Anyone can call this function to check certificate authenticity.
* It returns:

  * Student Name
  * Course
  * Grade
  * Issue Date

---

## 🔹 Logic Explanation

* Certificates are stored using a **mapping**, where each certificate is identified by a unique ID.
* A **struct** is used to define the structure of a certificate.
* The `require()` function ensures:

  * Only admin can add certificates
  * Duplicate certificates are not allowed
  * Certificate must exist before verification
* Blockchain ensures:

  * Data is immutable (cannot be changed)
  * High security and transparency

---
