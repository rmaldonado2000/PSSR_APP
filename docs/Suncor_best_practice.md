Cybersecurity Application Development Best Practice

**Owner:** Director Cybersecurity

**Approver:** Director Cybersecurity

**First Effective:** September 2022

**Last Updated:** August 18, 2025

**Last Approved** December 5, 2024

**Last Reviewed:** March 5, 2026

**Reviewed:** Annually

# Summary of Changes

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Location of Change</strong></p></th><th><p><strong>Summary of Change</strong></p></th></tr><tr><td><p>Entire Document</p></td><td><p><strong>Revision 4.0, August 2025</strong></p><p>Updates and edits to align this governing document with other cybersecurity governing documents and current state of the business.</p><ul><li>Changed 'Guideline' to 'Best Practice' as per the enterprise-wide template changes for 2025</li><li>Added document details box to first page.</li><li>Alignment with terminology - cyber assets are now called 'digital assets'; updated throughout document (e.g., 'Technology Resource Owner' changed to 'Digital Asset Owner')</li><li>Added AI based applications to the scope of the document</li></ul></td></tr><tr><td><p>Additional Requirements</p></td><td><p>New Additions:</p><ul><li>Section 1:<ul><li>Clarified scope by adding a description of digital assets</li></ul></li><li>Section 2<ul><li>Added BP2.1.4 - Standard Bill of Materials for all application components</li><li>Added BP2.1.15 - CI/CD pipelines, do not use static authentication</li><li>Added BP2.1.33 - Use version control for development environments</li><li>Added BP2.1.35 - Track dependencies and packages of components</li><li>Added BP2.2.1 - Consider using multi-platform development environments/tools</li><li>Added BP2.4.13-AI, ML, and LLM in application development</li><li>Added BP2.4.14 - Memory Safe Language</li><li>Addition to BP2.5.10 - do not use static credentials (CI/CD)</li></ul></li></ul></td></tr><tr><td><p>Additional Content</p></td><td><p>Section 3</p><ul><li>Added definition for 'Digital Asset and 'Secure by Design', added</li></ul><p>acronyms AIBOM, AI, CI/CD, LLM, and ML</p></td></tr></tbody></table></div>

Sensitivity: Internal

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Location of Change</strong></p></th><th><p><strong>Summary of Change</strong></p></th></tr><tr><td><p>Entire Document</p></td><td><p><strong>Revision 3.0, August 2024</strong></p><p>Updates and edits to align governing documents with other cybersecurity governing documents and current state of the business.</p><p>New:</p><ul><li>Classified document as 'Internal' (see Suncor's SUN-00196 Information Sensitivity Classification Standard)</li><li>Section 1:<ul><li>Clarified scope by identifying types of applications to which this standard applies (including cloud-based, AI based and containerized application development)</li><li>Added Application Testers to target audience</li><li>Added 'Introduction'</li></ul></li><li>Section 2<ul><li>Roles and Responsibilities, added the role and responsibility of Application Tester</li></ul></li><li>Section 4: Added several External Resources (NIST, NIST Special Publication, OWASP)</li></ul><p>Changes:</p><ul><li>Changed governing document name; from 'Application Development Security Guideline to 'Cybersecurity Application Development Guideline'</li><li>Reformatted the guiding statements to include the preface GL (e.g., GL2.2.4) to simplify references to guidelines provided in Cybersecurity Risk Assessment documents, clearly delineating between requirements and guidance</li><li>A new statement regarding caching has been added to the Data Protection section of the document (GL2.1.15)</li></ul></td></tr></tbody></table></div>

| **Location of Change** | **Summary of Change**                                  |
| ---------------------- | ------------------------------------------------------ |
| Entire Document        | **2022** This is the initial revision of the document. |

Sensitivity: Internal

# Contents

[Summary of Changes 2](#_bookmark1)

[Contents 4](#_bookmark2)

- [About this Best Practice 5](#_bookmark3)

[Purpose 5](#_bookmark4)

[Scope 5](#_bookmark5)

[Target Audience 5](#_bookmark6)

[Introduction 6](#_bookmark7)

- [Best Practices 7](#_bookmark8)
  - [Application and Development Security 7](#_bookmark9)

[Application Security Controls 7](#_bookmark10)

[Authentication and Access 9](#_bookmark11)

[Data Protection 9](#_bookmark12)

[Test Data 10](#_bookmark13)

[Patch Testing 10](#_bookmark14)

[Change Control 10](#_bookmark15)

[Development Environment 11](#_bookmark16)

[Trusted Components 11](#_bookmark17)

[Defects and Vulnerabilities 12](#_bookmark18)

- 1. [Mobile Application Development Security 14](#_bookmark19)

[Standards-Based Development 14](#_bookmark20)

- 1. [Hardening of Retail Promotional Software 17](#_bookmark21)
  - [Emerging Cybersecurity Practices for Secure Application Development 20](#_bookmark22)
  - [Cybersecurity Best Practices for AGILE Application Development 21](#_bookmark23)

- [Terms and Definitions, Acronyms and Expansions 23](#_bookmark24)
- [References 26](#_bookmark26)

[Essential Documents 26](#_bookmark27)

[Referenced Documents 26](#_bookmark28)

[External Documents 27](#_bookmark29)

- [Approval 28](#_bookmark30)

Sensitivity: Internal

# About this Best Practice

### Purpose

### Scope

### Target Audience

This best practice supports [001 Cybersecurity Application Development Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F001%2DApplication%2DDevelopment%2DSecurity%2DStandard%5F2023%2DFINAL%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies) with guidance on security issues in applications, including information for setting up development and test environments.

This best practice applies to all application development for use by Suncor's

personnel or made available to the public in the context of business operations. This includes:

- Artificial Intelligence (AI) based application development
- Application development in a container computing environment (i.e., the practice of packaging an application and its dependencies into a lightweight, standalone container that can run consistently across different environments).
- Cloud-based application development.

The applications being developed are considered digital assets. The following is a non-exhaustive list of digital asset types\*:

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Physical and Virtual Assets</strong></p></th><th><p><strong>Software Assets</strong></p></th><th><p><strong>Data Assets</strong></p></th></tr><tr><td><ul><li>Computer hardware</li><li>Network and communication equipment</li><li>Other infrastructure equipment</li><li>Cellular phones and mobile devices</li></ul></td><td><ul><li>Software for applications, systems, databases, networking, security, and control</li><li>Development tools and utilities</li></ul></td><td><ul><li>Databases and data files</li><li>Contracts and agreements</li><li>System documentation</li><li>User manuals. training material, operational procedures</li><li>Business continuity plans</li><li>Fallback procedures</li><li>Audit trails</li><li>Archived information</li></ul></td></tr></tbody></table></div>

\* Refer to Section [3,](#_bookmark24) Terms and Definitions for examples of digital assets.

This best practice applies to Suncor Energy Inc., its subsidiaries and any joint ventures operated by Suncor Energy Inc. or its subsidiaries (collectively "Suncor" or "the company" or "enterprise-wide").

Sensitivity: Internal

### Introduction

As used in this document, "Suncor Personnel" includes directors, officers, employees and independent contractors (formerly referred to as contract workers) of Suncor as well as employees of any joint ventures operated by Suncor.

Specifically, this best practice applies to:

- Domain Owner - Suncor business leader responsible for engaging the Application Owner and Digital Asset Owner
- Application Owner - Suncor leader who is responsible for the design, operation and maintenance of an application, as inventoried in Suncor's centralized asset Configuration Management Database (CMDB)
- Digital Asset Owner - personnel responsible for implementing and managing the infrastructure that supports an application
- Application Development Team
- - personnel responsible for the creation, development, update or maintenance of an application (including the suppliers contracted for similar tasks); application development team can be a subset of a Project Team
- Project Team - includes personnel such as the project manager (PM) or scrum master, project administrator, and product owner
- Application Testers - personnel responsible for detecting any vulnerabilities in software that has been developed

The Suncor Cybersecurity team is aligned to the National Institute of Standards and Technology (NIST) Cybersecurity Framework and uses this approach as the foundation to govern the cybersecurity program and manage cybersecurity risks.

The NIST Special Publication on Secure Software Development Framework (SSDF), Version 1.1 (see Section [4,](#_bookmark26) [References](#_bookmark25)) can be used as an adjunct to this best practice. There are also several other NIST special publications and Open Web Application Security Project (OWASP) frameworks included as references that can expand understanding around the role of cybersecurity in relation to application development.

Sensitivity: Internal

# Best Practices

## Application and Development Security

### Application Security Controls

The following are best practices for developing and testing application security controls, pieces that are separate from the app itself, and minimize risk within the application. To avoid potential security issues and known vulnerabilities when developing source code, this best practice should be reviewed within the context of business need and project scope.

Developers should develop and test applications using defined coding and testing best practices that address application security vulnerabilities.

**Note:** For example, when developing internet or intranet applications, source code should be developed and tested to address vulnerabilities identified by the Open Web Application Security Project (OWASP) Top 10.

BP2.1.1Throughout the conception (design), operation (use) and maintenance (sustainment) of applications, application owners shall ensure the following security controls are in place:

- - - 1. 'Secure by design' structured approach (e.g., the NIST SSDF - Secure Software Development Framework) used in conception and operation of applications. Refer to <https://www.cisa.gov/securebydesign> for some general guidance.

BP2.1.2 OWASP should be the reference for most common application coding vulnerabilities.

BP2.1.3 Application components should be traceable to business functionality stated in the requirement documents.

BP2.1.4 Application components should be tested to identify security weaknesses.

BP2.1.5 All application components should be captured in a Standard Bill of Materials (SBOM) that can be uploaded, and is readable, in ServiceNow.

BP2.1.6 Opensource code and commercial off-the-shelf (COTS) software packages should be tested and verified as follows:

- - - - - Test in an isolated low-privilege development environment to validate that the application does not execute uploaded data from untrusted sources. - Verify against integrity checks (such as digital signatures). - Before developing an application, assess source code vulnerabilities and remediation action success (back doors,

arbitrary remote code execution, access and authentication related code vulnerabilities, etc.).

- - - - - In scalable application deployment, technology resource owners are to assure the availability of a verification tool to conduct automatic dependencies and integration checks and after application software packaging.

BP2.1.7 Application business limits that require alerts or automated notifications to be configured should be identified.

### Authentication and Access

The following are best practices for application authentication and access.

BP2.1.8 Authentication credentials should **not** be stored in plain text or in reversible format and should **not** be prefilled by the application.

**Note:** Credentials can be kept safe with the use of a secrets manager such as Azure Key Fault or HashiCorp Vault.

BP2.1.9 Authentication controls should be enforced on the application development environment.

BP2.1.10 Application account identity recovery functions (update profile, forgot password, disabled/lost token, etc.) should use a secondary offline recovery mechanism (mobile push, soft token, etc.), or use secret questions to prevent access to the account without authentication.

BP2.1.11 All authentication events should be logged as described in [009 Security](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F009%2DSecurity%2DMonitoring%2Dof%2DSuncor%2DTechnology%2DResources%2DGuideline%2D%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies) [Monitoring of Suncor Technology Resource Guideline.](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F009%2DSecurity%2DMonitoring%2Dof%2DSuncor%2DTechnology%2DResources%2DGuideline%2D%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)

BP2.1.12 Applications should **not** allow directory browsing, discovery or disclosure unless requested and approved for a business need.

BP2.1.13 The principle of **least privilege** should be adopted, with users and developers only allowed to access specifically authorized objects.

BP2.1.14 Application web servers should be configured by default to deny access to remote resources or systems.

BP2.1.15 Application web servers and data servers that are accessible via the cloud should use Suncor-approved multi-factor authentication (MFA). See the Cloud Security Specification for details.

BP2.1.16 CI/CD pipelines should not use static authentication.

### Data Protection

The following are best practices for protection of internal, restricted or confidential application data. Refer to [SUN-00196 Data Sensitivity Classification Standard](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00196%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub) for further information.

BP2.1.17 Based on the application's asset class (see Business Impact Assessment and Disaster Recovery Standard) controls for caching should ensure that there is no avenue for inadvertent data exposure. The higher the asset class, the more precautions should be applied.

BP2.1.18 Caching should not be used when data is classified as Restricted, Confidential or Personally Identifiable Information (PII).

BP2.1.19 An application should have the ability to remove or archive each type of data from the application at the end of the required or defined retention period.

Sensitivity: Internal

BP2.1.20 Automated application access to data should be logged, and if possible targeted for use cases defined during the application's design phase, and integrated with Suncor's security information and event management (SIEM) in adherence to [009 Security Monitoring of Suncor](http://ecm/ecmlivelinkprd/llisapi.dll/674092606/Security_Monitoring_Guideline.pdf?func=doc.Fetch&nodeid=674092606) [Digital Asset Best Practice.](http://ecm/ecmlivelinkprd/llisapi.dll/674092606/Security_Monitoring_Guideline.pdf?func=doc.Fetch&nodeid=674092606)

BP2.1.21 Application connections (such as external and backend connections) to other systems should be authenticated and encrypted with Transport Layer Security (TLS) or valid trusted certificates.

BP2.1.22 Backend TLS-encrypted connection failures or certificate errors should be logged.

BP2.1.23 Files and data obtained from untrusted sources should be validated as the expected file type and scanned by malware scanners.

BP2.1.24 To protect against common command injection vulnerabilities, applications should **not** be integrated with technologies that are not supported natively via browser standards. The application input fields should be protected against SQL injection attacks.

**Test Data** The best practices below are for protecting application test data.

BP2.1.25 Test data should be sanitized to exclude personal identifiable information (PII).

BP2.1.26 If it is not possible to use dummy or scrambled data, test data should be wiped securely from the development environment upon test completion.

BP2.1.27 An audit trail should be maintained to log the copying and use of any production data.

### Patch Testing

### Change Control

The Best practice below applies to release and patch testing.

BP2.1.28 Before being implemented in the application, releases and patches should be tested and verified according to [003 Cybersecurity Threat](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1) [Management Standard.](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1)

The following are best practices for application changes and restrictions management.

BP2.1.29 Changes to the application software packages should adhere to [003](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1) [Cybersecurity Threat Management Standard.](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1)

BP2.1.30 All modifications to software packages and all changes should be approved, monitored, tested and documented.

Sensitivity: Internal

BP2.1.31 A functional specification document that clearly describes the requirements of changes requested by the business should be created and approved.

BP2.1.32 The software package change request processing and approval should adhere to [004 Configuration Management Guideline.](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F004%2DConfiguration%2DManagement%2DGuideline%2D%2D%2D2023%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)

### Development Environment

The following are best practices for the management of development environments.

BP2.1.33 For customized, **not** commercial off-the-shelf (COTS), software that is developed through third-party agreements, the lifecycle of the application should be managed including the following:

- Licensing, code ownership, and Intellectual property rights.
- Agreements that include rights to audit quality and accuracy of the developed software.
- Application development environment access, authorization, and test data to support other application development best practices.

**Note**: When using open-source development tools (e.g., downloading a Python interpreter) ensure that the tools are clean with no malware present.

BP2.1.34 Version control should be used to track changes in the development environment, ensuring that the most up-to-date environment is being used.

### Trusted Components

The following are best practices to ensure trusted components are managed and controlled.

**Note:** Examples of trusted elements include Domain Name System (DNS) server and Certificate Authority (CA) or certification server.

BP2.1.35 The use of trusted system components (people, processes, technology) to maintain protection should be minimized. Where technology is used, hardware, firmware and software should be designed and implemented so that only a minimum of system elements need to be trusted to maintain protection.

BP2.1.36 All dependencies and packages used should be tracked, vetted, and managed for vulnerabilities.

BP2.1.37 Trusted system components should be protected as follows:

Sensitivity: Internal

### Defects and Vulnerabilities

- Identify and document all existing and new trusted components (people, processes, technology) using a Cybersecurity threat modelling approach, as applicable. (e.g., STRIDE, OWASP and MITRE ATT&CK Framework)
- Ensure trusted elements and trusted boundaries (interfaces, communication channels, etc.) are protected with technical and non-technical security controls.
- Solution acceptance should be supported by manual and automated vulnerability assessment.

BP2.1.38 All data should be protected at the source as follows:

- Identify and classify data sources
- Apply adequate data protection mechanisms at the data source (tokenization, hashing, encryption, etc.)
- Handle exceptions through the exception management process including documentation and approval by the application owner, Cybersecurity Team and other impacted areas (depending on data ownership and compliance requirements)

The following are best practices related to vulnerabilities and defect management.

BP2.1.39 The overall risk ranking of the vulnerability or defect and the asset criticality class should be managed as follows:

- Ensure that identified vulnerabilities and defects are prioritized and addressed based on risk, required effort and asset class
- Follow the risk assessment process to identify the level of risk associated with a vulnerability or defect including probability, impact and risk classification
- Consider threat and vulnerability factors, and technical and business impact. Implement compensating controls and workarounds as appropriate.

BP2.1.40 The effort to remediate the vulnerability or defect should be managed as follows:

- Identify a remediation plan and course of action for the identified vulnerability.
- Align the plan to the Cybersecurity Risk Assessment and its findings. (see 012 Cybersecurity Risk Management Standard and 013 Cybersecurity Risk Assessment Specification)

Sensitivity: Internal

- Monitor and document vulnerability and risk remediation.

BP2.1.41 Developers should use automated tools or manual spot checks to review source code for common programming defects that can adversely impact application or system security.

**Note**: Example defects include:

- Cross-site scripting vulnerabilities
- Buffer overflow
- Race conditions
- Object model violations
- Poor user input validation
- Poor error handling
- Exposed security parameters
- Hardcoded passwords
- Violations of security policies, standards and architecture

BP2.1.42 Developers should use the following measures to ensure the application fails securely:

- - Implement proper error handling, i.e., a failure should cause the

system to "fail closed".

- - Do **not** expose internal, restricted or confidential data.
    - Do **not** leave the system in an open or insecure state, i.e., do not

"fail open".

BP2.1.43 Implement secure coding practices to mitigate common vulnerabilities, such as input validation, output encoding, and proper error handling.

BP2.1.44 Conduct regular security code reviews and penetration testing (pen testing) to identify and address any security weaknesses in the application.

BP2.1.45 Implement secure asset and configuration management practices (e.g., using CMDB to document configuration details) to ensure that the application is deployed with secure default settings and that configurations are regularly reviewed and updated.

BP2.1.46 Establish secure coding best practices for specific programming languages or frameworks commonly used in application development within Suncor.

BP2.1.47 Incorporate secure software development practices within the agile development methodology, including the identification of security requirements, conducting threat modeling exercises, and performing security testing iteratively throughout the development process.

Sensitivity: Internal

BP2.1.48 Ensure that developers are trained and educated on secure coding practices and are kept up to date with the latest security threats and vulnerabilities.

BP2.1.49 It is strongly recommended that the development team uses and relies on Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST) tools to analyze code for security vulnerabilities prior to the code being executed.

## Mobile Application Development Security

### Standards-Based Development

The following are best practices for mobile application security based on the OWASP standard.

BP2.2.1 When possible, consider using multi-platform development environments/tools (e.g., a toll that can develop code for android and iOS simultaneously) to reduce the risk of errors between environments.

BP2.2.2 The mobile application transport layer security (TLS) should be protected as follows:

- - - Secure all endpoints used by a mobile application with encryption such as TLS (preferred).
      - Validate that all certificates are legitimate and signed by public authorities or certificate authorities (CA).
      - Ensure that all certificates are appropriately renewed so that there are not active certificates around for an extended period of time.

BP2.2.3 Data storage on mobile devices should be secured to protect against side-channel data leakage as follows:

- - - Disable screenshots - screenshots (allowed by iOS and Android) can lead to potential leaks of customer data.
      - Disable key stroke logging - information entered via iOS or Android keyboards is automatically logged in the application directory, which could lead to leaks of customer data.
      - Secure control of debugging messages - set the application data to **not** write internal, restricted or confidential data in debugging logs and messages.
      - For internal, restricted, confidential or un-classified documents (see [SUN-00196 Data Sensitivity Classification Standard](https://suncor.sharepoint.com/sites/EntGovDocs/_layouts/15/DocIdRedir.aspx?ID=ENTGOVDOCS-366057626-111)), disable clipboard copy and open-in functionality.

Sensitivity: Internal

- - - Eliminate the use of temporary directories on devices to store application data.
      - Use trusted validated third-party libraries - libraries from untrusted parties can be infected with malware.
      - Control or limit analytics data sent from mobile applications to third parties and verify that sent data are public information.

BP2.2.4 Mobile applications should be authorized and authenticated as follows:

- - - Eliminate mobile application end users from authenticating using device identifiers or a phone number. Enhanced authentication such as contextual identifiers, or conditional access, should be used (e.g., device location, voice and fingerprints).
      - While applications can support many user roles, Access Control Services (ACS) should be enforced on the application server to define roles and privileges based on the principle of **least-privilege**.

BP2.2.5 The following should be considered for mobile application cryptography (the principles, means, and methods for rendering plain information unintelligible and for restoring encrypted information to intelligible form):

- - - Do **not** use easily defeated encryption algorithms (e.g., MD5, Data Encryption Standard (DES)).
      - Do **not** store encryption keys with encrypted data.
      - Do **not** mistake Base 64 encoding and code obfuscation for an encryption mechanism, i.e., don't try to hide things to make them obscure.
      - Do **not** rely on root certificates stored in the operating system for encryption because new root certificates can be added, resulting in loss of data authenticity and integrity.
      - Where appropriate, use certificate pinning, with caution, to encrypt communication and mutual authentication as it requires regular code reviews to remain strong.

BP2.2.6 The following should be considered to reduce the risk of mobile application side injection and Cross Site Scripting (XSS):

- - - Mobile applications should **not** draw content from different sources with data delivered through a remote server.
      - Applications can be vulnerable to XSS injections and Cross Site Request Forgery (CSRF) caused by Uniform Resource Locator (URL) information caching on any web server.

Sensitivity: Internal

- - - XSS should be mitigated by implementing MFA for mobile application remote connections that derive content using a remote URL.
      - CSRF should be mitigated by using a list of specifically permitted sites, which allows only the permitted domains to open and connect with the targeted application.

BP2.2.7 The following measures for mobile application data input security should be considered:

- - - Mobile application data sent to or received by a third party should be validated and subject to tamper detection on the application server side; the input should be protected against injection attacks.
      - Where applicable, JavaScript Object Notation (JSON) parsing or encoding application programming interface (API) should be used to validate and control any parameters sent through a URL scheme launching application from another application.
      - Inter-application communication should be enabled with trusted third-party applications only.

BP2.2.8 The following should be considered for mobile application connections and session handling:

- - - Session timeout in the login server connection should be less than server-side session timeout.
      - Mobile application sessions should expire automatically after 5 minutes of inactivity.
      - Device IDs should **not** be used as a session token because they never expire. For token PIN requirements, please refer to

[SUN-00252 Identification, Authorization and Access](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00252%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub) [Management Specification.](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00252%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub)

- - - Centralized Mobile Device Management (MDM) solution for managing and securing enterprise data and application sessions should be used on mobile end points.

**Examples:** Common MDM security features include mandatory password protection (encryption), application jailbreak detection, device remote wipe-out, device remote lock, full device encryption, mobile application data encryption, malware detection, Virtual Private Network (VPN) configuration and management, WIFI configuration and management. At Suncor, the Centralized MDM is Intune.

BP2.2.9 The following should be considered for mobile application binary hardening:

- - - - Store API keys and application business logic on the application server side, and download based on application need and business approval only. - Do **not** store passwords in the application binary, never hardcode a password to an application source. - Verify that applications do **not** write data classified as restricted and/or confidential to log files as external threat actors can monitor the files.

BP2.2.10 Implement secure communication protocols for mobile applications, such as certificate pinning and certificate validation, to protect against man-in-the-middle attacks.

BP2.2.11 Implement secure session management techniques, including the use of secure session tokens, session expiration and session revocation mechanisms.

BP2.2.12 Apply appropriate input validation techniques to prevent common mobile application vulnerabilities, such as SQL injection, cross-site scripting (XSS) and remote code execution.

BP2.2.13 Implement secure data storage practices, including encryption of sensitive data at rest, secure key management and secure data deletion when no longer needed.

BP2.2.14 Implement secure authentication methods, such as biometric authentication (fingerprint, face recognition), two-factor authentication (2FA), or multi-factor authentication (MFA) for enhanced user authentication. Use conditional or contextual access where available.

BP2.2.15 Conduct rigorous security testing, including mobile application penetration testing, security code reviews, and security assessments of third-party libraries and components used in the mobile application.

BP2.2.16 Implement secure update and patch management processes for mobile applications to ensure timely deployment of security patches and updates. (see [003 Cybersecurity Threat Management Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1)).

## Hardening of Retail Promotional Software

The following should be considerations for the hardening, through the addition of cybersecurity controls, of Suncor's retail division promotional software (mobile or web), grouped by team responsibilities.

| **Team**             | **Responsibilities**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Development Team** | BP2.3.1 Ensure a secure registration process for customer sign up.<br><br>BP2.3.2 Check the validity of the email at registration.<br><br>BP2.3.3 Document the data model identifying what is privacy data, or data subject to regulatory compliance such as Payment Card Industry (PCI). This assists with implementing Data Loss Prevention (DLP) as the system is put into production.<br><br>BP2.3.4 Develop the application so that information useful to an attack is **not** provided during failed login attempts.<br><br>BP2.3.5 Consider using blockchain encryption or other suitable encryption for storing loyalty information where appropriate.<br><br>BP2.3.6 As software is being developed, perform vulnerability testing with appropriate testing tools before the software goes into production.<br><br>BP2.3.7 Implement secure session management techniques, such as session tokens, to prevent session hijacking and ensure that session data is properly secured.<br><br>BP2.3.8 Implement secure password storage mechanisms, such as hashing and salting, to protect user credentials in the database.<br><br>BP2.3.9 Implement secure input validation to prevent common vulnerabilities like SQL injection, cross-site scripting (XSS), and command injection.<br><br>BP2.3.10 Implement secure file handling practices, including validating and sanitizing file uploads, preventing unauthorized access to uploaded files, and scanning uploaded files for malware.<br><br>BP2.3.11 Implement secure error handling mechanisms to avoid exposing sensitive information in error messages and provide meaningful error feedback to users. |

| **Team**                                             | **Responsibilities**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                      | BP2.3.12 Regularly update and patch software components, including third-party libraries and frameworks, to address known vulnerabilities.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Cybersecurity Team**                               | BP2.3.13 Monitor the platform for suspicious activities. This can be accomplished by integrating the application with Suncor's monitoring services, such as Microsoft Sentinel.<br><br>BP2.3.14 Implement a Web Application Firewall (WAF) to protect against common web application attacks, such as SQL injection, cross-site scripting (XSS) and cross-site request forgery (CSRF).<br><br>BP2.3.15 Corporate vulnerability management should be taking place on the application to identify when and which patches are needed.                                                          |
| **Privacy Team, Development Team and Business Unit** | BP2.3.16 Ensure that Personally Identifiable Information (PII) (Privacy Team) and PCI data (Business Unit) are protected according to Suncor compliance standards. (See PCI DSS v4.0)<br><br>BP2.3.17 Implement data anonymization techniques to protect sensitive customer data while still maintaining its utility for business analytics and reporting purposes.<br><br>BP2.3.18 Develop and enforce data retention policies to ensure that customer data is stored only for as long as necessary (e.g., by regulation or compliance) and is securely disposed of when no longer needed. |
| **Development Team and Cybersecurity Team**          | BP2.3.19 Develop or purchase software to allow for regular testing during its lifecycle.<br><br>BP2.3.20 Perform penetration testing for retail applications that deal with content with monetary value (such as points).<br><br>BP2.3.21 Conduct regular security code reviews and security testing throughout the software development lifecycle to identify and address security vulnerabilities.                                                                                                                                                                                        |

| **Team** | **Responsibilities**                                                                                                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|          | BP2.3.22 Perform regular penetration testing, vulnerability assessments and risk assessments to proactively identify and remediate potential weaknesses in the application, particularly for components handling sensitive data or monetary transactions.<br><br>BP2.3.23 When a material change is made to an application, perform a risk assessment. |

## Emerging Cybersecurity Practices for Secure Application Development

Suncor Application Development Teams should ensure that they are aware of and where applicable, including or following these practices for Secure Application Development:

BP2.4.1 **Secure Development Lifecycle** (SDLC): This framework ensures security from the earliest stages of the development process. It integrates secure design, coding, and testing into existing software development workflows.

BP2.4.2 **Threat Modelling**: In this process, potential threats, such as vulnerabilities or weaknesses, are identified, and their potential impacts are assessed. This helps prioritize mitigation strategies and security measures.

BP2.4.3 **Secure Coding Practices**: These are best practices aimed at avoiding errors that could lead to serious vulnerabilities. This includes validating all inputs, enforcing access controls, and managing memory correctly.

BP2.4.4 **Automated Security Testing**: This involves the use of automated tools to test software for security vulnerabilities. Automated testing can include static application security testing (SAST), dynamic application security testing (DAST), and interactive application security testing (IAST).

BP2.4.5 **Continuous Integration and Continuous Delivery/Deployment** (CI/CD): By automating the integration and deployment of code, developers can quickly catch and fix security vulnerabilities.

BP2.4.6 **Security Chaos Engineering**: Inspired by chaos engineering, this practice involves deliberately injecting faults into a system to test its resilience and to identify vulnerabilities.

BP2.4.7 **Container Security**: With the rise of containerization technologies like Docker, Kubernetes, OpenShift, etc. securing these containers is essential. This involves securing the container pipeline, ensuring the

security of the underlying host, and regularly scanning container images for vulnerabilities.

BP2.4.8 **Microservices Architecture Security**: This involves securing individual services in a microservices architecture. This can include methods like implementing robust API security, isolating services, and using secure service-to-service communication.

BP2.4.9 **API Security**: As APIs are now a crucial part of many applications, securing them is of paramount importance. This can involve practices like validating and limiting inputs and outputs, securing underlying servers, and using API gateways for additional security.

BP2.4.10 **Zero Trust Architecture**: This security model assumes that any user or device, even those inside Suncor's network, could be a threat.

Therefore, every request is validated, every user is authenticated, and every device is checked, regardless of whether it's inside or outside the network. At Suncor our primary zero trust system is zScaler.

BP2.4.11 **DevSecOps**: This practice integrates security into the DevOps process.

It encourages everyone involved in the development process to take responsibility for security, resulting in increased speed and efficiency in identifying and mitigating security risks.

BP2.4.12 **Privacy by Design**: With the rise of data protection regulations worldwide, privacy considerations should be an integral part of the software design process. This involves considering data minimization, transparency, and user consent throughout the development process.

BP2.4.13 **AI, ML and LLM**: Mask or tokenize sensitive data that is in training datasets. Track the model data set and any applicable pre- or post-processing in the AI Bill of Materials (BOM). Require peer review and scanning for any AI generated code. Apply additional safeguards aligned with the OWASP Top 10 for LLMs.

BP2.4.14 **Memory Safe Language**: use memory safe languages and compile time static analysis to look for memory leaks and possible buffer overflow.

## Cybersecurity Best Practices for AGILE Application Development

The following should be considered for use within Suncor projects following AGILE development techniques:

BP2.5.1 **Incorporate Security in User Stories**: Make security a consideration for every user story. This can include requirements related to encryption, authentication, access controls, and other security concerns. Each story can also have associated acceptance criteria related to security.

Sensitivity: Internal

BP2.5.2 **Include Security in the Definition of Done**: The definition of "Done" for each sprint or iteration should include appropriate security checks and tests. This can help ensure that new features or changes don't introduce vulnerabilities.

BP2.5.3 **Conduct Regular Threat Modeling**: As part of the Agile process, regular threat modeling can help identify and prioritize potential security threats. This can be incorporated into the sprint planning process.

BP2.5.4 **Use Automated Security Testing Tools**: Automated security testing tools should be used to quickly identify and fix potential vulnerabilities. This can include tools for static application security testing (SAST), dynamic application security testing (DAST), and interactive application security testing (IAST).

BP2.5.5 **Apply Secure Coding Practices**: Developers should be trained in secure coding practices and should apply these practices consistently. This includes practices like validating all inputs, managing memory correctly, and following the principle of least privilege.

BP2.5.6 **Security Training**: Since Agile emphasizes the involvement of all team members, it's important that everyone on the team has a good understanding of security principles. Regular training can help ensure that everyone is up to date on the latest threats and best practices.

BP2.5.7 **Regular Code Reviews**: Regular peer code reviews can help catch potential security issues that automated tools might miss. Code reviews can also be a good opportunity for team members to learn from each other and improve their secure coding practices.

BP2.5.8 **Incorporate Security in Retrospectives**: In the Agile retrospective meetings, discuss what security measures worked well and what needs improvement. This continuous feedback loop will help improve security over time.

BP2.5.9 **Build a Security-Focused Culture**: Encourage a culture where security is everyone's responsibility, not just the security teams. This can help ensure that security is a consideration in all decisions.

BP2.5.10 **Continuous Integration and Continuous Delivery/Deployment** (CI/CD): Implement CI/CD pipelines with integrated security checks. This allows for earlier and more frequent testing, which can help catch and fix security issues faster. Ensure that authentication for CI/CD pipelines is not based on static credentials.

BP2.5.11 **Involve a Security Champion**: Designate a team member as a "security champion" for each Agile team. This person should have some security expertise and can help the rest of the team understand and implement security measures.

BP2.5.12 **Use a Risk-Based Approach**: Prioritize security efforts based on risk. Not all vulnerabilities are equal, and it's important to focus on the issues that pose the greatest threat to your application or to Suncor.

# Terms and Definitions, Acronyms and Expansions

| **Term**                              | **Definition**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business Requirement**              | A specific expectation, condition or obligation outlined in a Governing Document for the performance by personnel, systems or business processes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Compliance**                        | The expectation of business operations to meet all relevant external regulatory requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Conformance**                       | The expectation of a business operation to adhere to relevant business requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Control**                           | Any safeguard or countermeasure which modifies risk.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Digital Assets**                    | At Suncor, a digital asset is a physical (hardware) asset, software asset or information asset.<br><br>**Physical assets** include computer hardware (i.e., servers, workstations, laptops, scanners), network and communication equipment (i.e., routers, switches, modems) and other infrastructure equipment (i.e., uninterruptable power supply (UPS)).<br><br>**Software assets** include application software, systems software, database software and databases, networking software security and control software and development tools and outlines.<br><br>**Information assets** include databases and data files, contracts and agreements, system documentation, user manuals, training materials, operational procedures, support procedures, business continuity plans, fallback procedures, audit trails and archived information. |
| **Governing Document**                | A published set of Suncor business requirements defined by business leaders to ensure compliance to legislation, regulations, contractual obligations, strategic outcomes, Industry Standards or to manage risk.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Incident**                          | An occurrence that actually or imminently jeopardizes the confidentiality, integrity or availability of an information system or the information the system processes, stores or transmits or that constitutes a violation or imminent threat of violation of security policies, security procedures or acceptable use policies. (NIST)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Risk**                              | The potential for loss, damage or destruction of an asset resulting from an identifiable incident. It is the possible intersection of assets and incidents and is analyzed to determine the likelihood and magnitude of consequence of the potential incident. Treatments for risk include eliminate, mitigate, transfer, accept and monitor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Secure by Design**                  | A framework that provides a structured approach to designing, developing, and deploying secure products and services with an emphasis on the importance of considering cybersecurity threats from the outset and implementing security measures. (NIST)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Software Bill of Materials (SBOM)** | SBOM is a structured inventory of all components-such as libraries, modules, and dependencies-used in a software product. Think of it as a "list of ingredients" for software, providing transparency into what the software is made of. This is crucial for:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Term</strong></p></th><th><p><strong>Definition</strong></p></th></tr><tr><td></td><td><ul><li>Security: Identifying known vulnerabilities in components.</li><li>Compliance: Managing licensing obligations.</li><li>Risk Management: Understanding supply chain dependencies.</li><li>Incident Response: Quickly assessing exposure during breaches.</li></ul><p>SBOMs are typically machine-readable and used across development, procurement, and operational stages to improve software supply chain security.</p></td></tr><tr><td><p><strong>Threat</strong></p></td><td><p>The potential for a threat source to successfully exploit a particular information or operational system vulnerability. (NIST)</p></td></tr><tr><td><p><strong>Threat Actor</strong></p></td><td><p>An individual or a group posing a threat that can result in harmful impact. (NIST)</p></td></tr><tr><td><p><strong>Vulnerability</strong></p></td><td><p>Weakness in an information system, system security procedures, internal controls or implementation that could be exploited or triggered by a threat source. (NIST)</p></td></tr></tbody></table></div>

For more cybersecurity terms and definitions, see the Glossary of Terms on the Cybersecurity and Privacy SharePoint page.

| **Acronym** | **Expansion**                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2FA**     | Two-Factor Authentication                                                                                                                                            |
| **AIBOM**   | AI Bill of Materials                                                                                                                                                 |
| **AI**      | Artificial Intelligence; e.g., SunChat or Microsoft Copilot                                                                                                          |
| **API**     | Application Programming Interface; a way for two or more computer programs or components to communicate with each other.                                             |
| **CA**      | Certificate Authority                                                                                                                                                |
| **CI/CD**   | Continuous Integration and Continuous Delivery/Deployment: the practice of automating the integration of code changes from multiple developers in a single codebase. |
| **CMDB**    | Configuration Management Database; Suncor's centralized asset management tool                                                                                        |
| **COTS**    | Commercial off-the-shelf                                                                                                                                             |
| **CSRF**    | Cross Site Request Forgery                                                                                                                                           |
| **DAST**    | Dynamic Application Security Testing                                                                                                                                 |
| **DES**     | Data Encryption Standard                                                                                                                                             |
| **DNS**     | Domain Name System                                                                                                                                                   |
| **IAST**    | Interactive Application Security Testing                                                                                                                             |

| **Acronym** | **Expansion**                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JSON**    | JavaScript Object Notation                                                                                                                        |
| **LLM**     | Large Language Model; specialized neural networks trained on vast amounts of text to understand and generate content. (NIST)                      |
| **MASVS**   | Mobile Application Security Verification Standard; OWASP standard that provides a basis for testing web application technology security controls. |
| **MDM**     | Mobile Device Management                                                                                                                          |
| **MFA**     | Multi Factor Authentication; an authentication system that requires more than one distinct authentication factor for successful authentication.   |
| **ML**      | Machine Language; The development and use of computer systems that adapt and learn from data with the goal of improving accuracy. (NIST)          |
| **NIST**    | National Institute of Standards and Technology                                                                                                    |
| **OWASP**   | Open Web Application Security Project                                                                                                             |
| **PII**     | Personally Identifiable Information                                                                                                               |
| **SAST**    | Static Application Security Testing                                                                                                               |
| **SBOM**    | Software Bill of Materials                                                                                                                        |
| **SDLC**    | Secure Development Lifecycle                                                                                                                      |
| **SIEM**    | Security Information and Event Management                                                                                                         |
| **SSDF**    | Secure Software Framework                                                                                                                         |
| **TLS**     | Transport Layer Security                                                                                                                          |
| **URL**     | Uniform Resource Locator                                                                                                                          |
| **VPN**     | Virtual Private Network                                                                                                                           |
| **WAF**     | Web Application Firewall                                                                                                                          |

# References

### Essential Documents

### Referenced Documents

The following documents need to be read in conjunction with this best practice for full understanding.

- Standards of Business Conduct - [The Way We Do Business](https://suncor.sharepoint.com/sites/AboutSuncor/SitePages/Standards-of-Business.aspx)
- [001 Application Development Security Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F001%2DApplication%2DDevelopment%2DSecurity%2DStandard%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
- [003 Cybersecurity Threat Management Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/003%20Cybersecurity%20Threat%20Management%20Standard.pdf?web=1)
- [004 Cybersecurity Asset Management Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F003%2DCybersecurity%2DAsset%2DManagement%2DStandard%2D%2D%2D2023%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
- [008 Cybersecurity Digital Asset Management Specification](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/Shared%20Documents/Governing%20Documents/008%20Cybersecurity%20Asset%20Management%20Specification.pdf?web=1)
- [006 Security Monitoring of Suncor Digital Assets Standard](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F006%2DSecurity%2DMonitoring%2Dof%2DSuncor%2DTechnology%2DResources%2DStandard%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
- [SUN-00142 Cybersecurity Policy](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2FSUN%2D00142%2D%2D%2DCybersecurity%2DPolicy%2DR3%2E0%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
- [SUN-00196 Data Sensitivity Classification Standard](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00196%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub)

The following documents have been referenced throughout this best practice. Enterprise Governing Documents:

- [SUN-00251 Identification, Authorization and Access Management Standard](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00251%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub)
- [SUN-00252 Identification, Authorization and Access Management](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00252%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub) [Specification](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00252%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub)
- [SUN-00253 Identification, Authorization and Access Management Guideline](https://suncor.sharepoint.com/sites/EntGovDocs/EGDPub/Forms/EGD%20Published%20View.aspx?id=%2Fsites%2FEntGovDocs%2FEGDPub%2FSUN%2D00253%2DEN%2Epdf&parent=%2Fsites%2FEntGovDocs%2FEGDPub)

Cybersecurity Governing Documents:

- - [004 Cybersecurity Configuration Management Guideline](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F004%2DConfiguration%2DManagement%2DGuideline%2D%2D%2D2023%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
    - [009 Security Monitoring of Suncor Digital Assets Guideline](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F009%2DSecurity%2DMonitoring%2Dof%2DSuncor%2DTechnology%2DResources%2DGuideline%2D%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
    - [010 Cloud Security Specification](https://suncor.sharepoint.com/sites/CyberSecurityandPrivacy/SiteAssets/Forms/AllItems.aspx?id=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies%2F010%2DCloud%2DSecurity%2DSpecification%5F2023%2DFINAL%2Epdf&parent=%2Fsites%2FCyberSecurityandPrivacy%2FSiteAssets%2FSitePages%2FCyber%2DSecurity%2DStandards%2C%2DGuidelines%2Dand%2DPolicies)
    - 012 Cybersecurity Risk Management Standard
    - 013 Cybersecurity Risk Assessment Specification)

### External Documents

The following documents are external references for this best practice.

- [NIST Cybersecurity Framework v2.0](https://csf.tools/reference/nist-cybersecurity-framework/v2-0/)
- [Open Web Application Security Project (OWASP)](https://owasp.org/) Mobile Application Security Verification Standard (latest version)
- [OWASP MASVS (Mobile Application Security Verification Standard)](https://mas.owasp.org/MASVS/)
- [NIST SP 800-53 Revision 5 - Security and Privacy Controls for Information](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) [System and Organizations](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- [NIST SP 800-218 Secure Software Development Framework Version 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)
- [NIST SP 800-190 Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- <https://www.cisa.gov/securebydesign>
- [Software Security in Supply Chains: Software Bill of Materials (SBOM) |](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity/software-security-supply-chains-software-1) [NIST](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity/software-security-supply-chains-software-1)

# Approval

The following individual has approved and signed this document.

| **Approver:** | Kevin McCarthy          |
| ------------- | ----------------------- |
| **Title:**    | Director, Cybersecurity |
| **Date:**     | March 5 2:37 pm MST     |