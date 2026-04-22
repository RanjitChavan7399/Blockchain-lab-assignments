// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Certificate {
        string studentName;
        string course;
        string grade;
        uint256 issueDate;
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    event CertificateAdded(string certificateId, string studentName);
    event CertificateVerified(string certificateId);

    // Add certificate (only admin)
    function addCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _course,
        string memory _grade
    ) public {
        require(msg.sender == admin, "Only admin can add certificates");
        require(!certificates[_certificateId].exists, "Certificate already exists");

        certificates[_certificateId] = Certificate({
            studentName: _studentName,
            course: _course,
            grade: _grade,
            issueDate: block.timestamp,
            exists: true
        });

        emit CertificateAdded(_certificateId, _studentName);
    }

    // Verify certificate
    function verifyCertificate(string memory _certificateId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        require(certificates[_certificateId].exists, "Certificate not found");

        Certificate memory cert = certificates[_certificateId];

        return (
            cert.studentName,
            cert.course,
            cert.grade,
            cert.issueDate
        );
    }
}