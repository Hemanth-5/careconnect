# Database Schema for CareConnect

## Introduction

This document outlines the database schema for the CareConnect application. The schema includes models for users, doctors, patients, appointments, and other related entities. Each model is designed to support the functionalities of the CareConnect application, including patient management, doctor scheduling, medical records, and communication.

## Models

### User

- **userId**: `String` (Unique identifier)
- **username**: `String`
- **password**: `String`
- **type**: `String` (e.g., Admin, Doctor, Patient)
- **firstName**: `String`
- **lastName**: `String`
- **dateOfBirth**: `Date`
- **gender**: `String`
- **contact**:
  - **email**: `String`
  - **phone**:
    - **primary**: `String`
    - **secondary**: `String`
  - **address**:
    - **street**: `String`
    - **city**: `String`
    - **state**: `String`
    - **zipcode**: `String`
    - **country**: `String`
- **profilePicture**: `String` (URL to profile picture)
- **profilePictureUploadId**: `String` (Upload ID in Cloudinary)
- **isProfileComplete**: `Boolean`

### Doctor

- **doctorId**: `String` (Unique identifier)
- **userId**: `String` (Reference to User model)
- **specialization**: `[String]`
- **education**:
  - **degree**: `String`
  - **institution**: `String`
  - **year**: `Number`
- **status**: `String` (e.g., Active, Inactive)
- **experience**:
  - **totalYears**: `Number`
  - **inSpeciality**: `Number`
- **schedule**:
  - **monday**: `String`
  - **tuesday**: `String`
  - **wednesday**: `String`
  - **thursday**: `String`
  - **friday**: `String`
  - **saturday**: `String`
- **languages**: `[String]`
- **certifications**: `[String]`
- **memberships**: `[String]`
- **awards**: `[String]`
- **researchInterests**: `[String]`
- **reviews**:
  - **patientId**: `String`
  - **rating**: `Number`
  - **comments**: `String`

### Patient

- **patientId**: `String` (Unique identifier)
- **userId**: `String` (Reference to User model)
- **emergencyContact**:
  - **name**: `String`
  - **relationship**: `String`
  - **phone**: `String`
- **insurance**:
  - **provider**: `String`
  - **policyNo**: `String`
  - **groupNo**: `String`
- **preferredDoctor**: `String`
- **medicalHistory**: `[String]`
- **appointments**:
  - **doctorId**: `String`
  - **date**: `Date`
  - **status**: `String`
- **prescriptions**:
  - **doctorId**: `String`
  - **medication**: `String`
  - **dosage**: `String`
  - **instructions**: `String`
- **labResults**:
  - **testName**: `String`
  - **result**: `String`
  - **date**: `Date`
- **allergies**: `[String]`

### Appointment

- **appointmentId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **time**: `String`
- **status**: `String` (e.g., Scheduled, Completed, Canceled)

### Consultation

- **consultationId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **notes**: `String`

### Disease

- **diseaseId**: `String` (Unique identifier)
- **name**: `String`
- **description**: `String`
- **symptoms**: `[String]`

### Facility

- **facilityId**: `String` (Unique identifier)
- **name**: `String`
- **location**:
  - **address**: `String`
  - **city**: `String`
  - **state**: `String`
  - **zipcode**: `String`
  - **country**: `String`
- **type**: `String` (e.g., Hospital, Clinic)
- **contact**:
  - **phone**: `String`
  - **email**: `String`

### HealthRecord

- **recordId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **details**: `String`

### LabTest

- **testId**: `String` (Unique identifier)
- **name**: `String`
- **description**: `String`
- **price**: `Number`

### MedicalReport

- **reportId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **details**: `String`

### Medication

- **medicationId**: `String` (Unique identifier)
- **name**: `String`
- **description**: `String`
- **price**: `Number`

### Message

- **messageId**: `String` (Unique identifier)
- **senderId**: `String` (Reference to User model)
- **receiverId**: `String` (Reference to User model)
- **content**: `String`
- **timestamp**: `Date`

### Notification

- **notificationId**: `String` (Unique identifier)
- **userId**: `String` (Reference to User model)
- **message**: `String`
- **date**: `Date`
- **status**: `String` (e.g., Read, Unread)

### Prescription

- **prescriptionId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **details**: `String`

### Review

- **reviewId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **doctorId**: `String` (Reference to Doctor model)
- **rating**: `Number`
- **comment**: `String`

### Schedule

- **scheduleId**: `String` (Unique identifier)
- **doctorId**: `String` (Reference to Doctor model)
- **date**: `Date`
- **availability**: `String` (e.g., Available, Not Available)

### Specialization

- **specializationId**: `String` (Unique identifier)
- **name**: `String`
- **description**: `String`

### TestResult

- **testResultId**: `String` (Unique identifier)
- **patientId**: `String` (Reference to Patient model)
- **labTestId**: `String` (Reference to LabTest model)
- **result**: `String`
- **date**: `Date`

## Relationships

- **User**:
  - Can be linked to multiple **Doctor**, **Patient**, **Message**, and **Notification** instances.
- **Doctor**:
  - Linked to multiple **Patient** (through appointments, consultations) and **MedicalReport**.
- **Patient**:
  - Linked to multiple **Doctor** (through appointments, consultations) and **MedicalReport**.
- **Appointment**:

  - Links **Patient** and **Doctor**.

- **Consultation**:

  - Links **Patient** and **Doctor**.

- **MedicalReport**:

  - Linked to **Patient** and **Doctor**.

- **Facility**:

  - Can have multiple **FacilityResource**.

- **HealthRecord**:

  - Linked to **Patient** and **Doctor**.

- **LabTest**:

  - Linked to **TestResult**.

- **Prescription**:

- Linked to **Patient** and **Doctor**.

- **Referral**:

  - Linked to **Patient** and **Doctor**.

- **Review**:

  - Linked to **Patient** and **Doctor**.

- **Schedule**:

  - Linked to **Doctor**.

- **Specialization**:

  - Used by **Doctor**.

- **TestResult**:
  - Linked to **Patient** and **LabTest**.

---
