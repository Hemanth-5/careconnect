const doctorRecords = [
    {
      id: 'doc1',
      name: 'Dr. John Doe',
      gender: 'Male',
      dateOfBirth: '1975-08-15',
      specialization: ['Cardiology', 'Internal Medicine'],
      education: [
        { degree: 'MD', institution: 'University Medical School', year: 2000 },
        { degree: 'PhD', institution: 'University Graduate School', year: 2005 },
      ],
      contact: {
        email: 'john.doe@example.com',
        phone: {
          primary: '+1 555-555-0001',
          secondary: '+1 555-555-0002',
        },
        address: {
          street: '123 Main Street',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country',
        },
      },
      status: 'active',
      experience: {
        totalYears: 20,
        inSpecialty: 15,
      },
      schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 12:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
      },
      languages: ['English', 'Spanish'],
      certifications: ['Board Certified in Cardiology', 'ACLS Certified'],
      memberships: ['American College of Cardiology', 'American Medical Association'],
      awards: ['Top Cardiologist of the Year 2019', 'Outstanding Physician Award 2020'],
      researchInterests: ['Heart Disease Prevention', 'Cardiac Imaging'],
      reviews: [
        { patient: 'Patient Name', rating: 4.5, comment: 'Highly knowledgeable and caring.' },
        { patient: 'Another Patient', rating: 5, comment: 'Excellent doctor, highly recommend!' },
      ],
    },
    {
      id: 'doc2',
      name: 'Dr. Emily Smith',
      gender: 'Female',
      dateOfBirth: '1980-03-25',
      specialization: ['Dermatology'],
      education: [
        { degree: 'MD', institution: 'University Medical School', year: 2005 },
        { degree: 'PhD', institution: 'University Graduate School', year: 2010 },
      ],
      contact: {
        email: 'emily.smith@example.com',
        phone: {
          primary: '+1 555-555-0003',
          secondary: '+1 555-555-0004',
        },
        address: {
          street: '456 Elm Street',
          city: 'City',
          state: 'State',
          zipCode: '54321',
          country: 'Country',
        },
      },
      status: 'active',
      experience: {
        totalYears: 15,
        inSpecialty: 10,
      },
      schedule: {
        monday: '8:00 AM - 4:00 PM',
        tuesday: '8:00 AM - 4:00 PM',
        wednesday: 'Not available',
        thursday: '8:00 AM - 4:00 PM',
        friday: '8:00 AM - 12:00 PM',
      },
      languages: ['English', 'French'],
      certifications: ['Board Certified in Dermatology', 'ABCD Certified'],
      memberships: ['American Academy of Dermatology', 'International Dermatological Society'],
      awards: ['Best Dermatologist Award 2018', 'Top Dermatologist of the Year 2020'],
      researchInterests: ['Skin Cancer Prevention', 'Cosmetic Dermatology'],
      reviews: [
        { patient: 'Patient X', rating: 4.8, comment: 'Great experience, highly recommend!' },
        { patient: 'Patient Y', rating: 4.5, comment: 'Very thorough and caring.' },
      ],
    },
    {
        id: 'doc3',
        name: 'Dr. Michael Johnson',
        gender: 'Male',
        dateOfBirth: '1982-11-10',
        specialization: ['Neurology'],
        education: [
          { degree: 'MD', institution: 'University Medical School', year: 2006 },
          { degree: 'PhD', institution: 'University Graduate School', year: 2011 },
        ],
        contact: {
          email: 'michael.johnson@example.com',
          phone: {
            primary: '+1 555-555-0005',
            secondary: '+1 555-555-0006',
          },
          address: {
            street: '789 Oak Street',
            city: 'City',
            state: 'State',
            zipCode: '67890',
            country: 'Country',
          },
        },
        status: 'inactive',
        experience: {
          totalYears: 18,
          inSpecialty: 12,
        },
        schedule: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 1:00 PM',
          thursday: 'Not available',
          friday: '9:00 AM - 5:00 PM',
        },
        languages: ['English', 'German'],
        certifications: ['Board Certified in Neurology', 'NCSN Certified'],
        memberships: ['American Academy of Neurology', 'International Neurological Association'],
        awards: ['Top Neurologist of the Year 2017', 'Outstanding Physician Award 2019'],
        researchInterests: ['Brain Mapping', 'Neurodegenerative Disorders'],
        reviews: [
          { patient: 'Patient A', rating: 4.6, comment: 'Very knowledgeable and attentive.' },
          { patient: 'Patient B', rating: 4.9, comment: 'Excellent care, highly recommended!' },
        ],
    },
    {
        id: 'doc4',
        name: 'Dr. Sarah Miller',
        gender: 'Female',
        dateOfBirth: '1978-03-25',
        specialization: ['Ophthalmology'],
        education: [
          { degree: 'MD', institution: 'Medical University', year: 2003 },
          { degree: 'PhD', institution: 'Graduate School of Medicine', year: 2008 },
        ],
        contact: {
          email: 'sarah.miller@example.com',
          phone: {
            primary: '+1 555-555-0007',
            secondary: '+1 555-555-0008',
          },
          address: {
            street: '456 Elm Street',
            city: 'City',
            state: 'State',
            zipCode: '34567',
            country: 'Country',
          },
        },
        status: 'active',
        experience: {
          totalYears: 20,
          inSpecialty: 17,
        },
        schedule: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 1:00 PM',
        },
        languages: ['English', 'French'],
        certifications: ['Board Certified in Ophthalmology', 'AAO Fellow'],
        memberships: ['American Academy of Ophthalmology', 'Eye Physicians Association'],
        awards: ['Top Ophthalmologist of the Year 2018', 'Excellence in Eye Care Award 2020'],
        researchInterests: ['Retina Disorders', 'Corneal Diseases'],
        reviews: [
          { patient: 'Patient C', rating: 4.7, comment: 'Great experience, very professional.' },
          { patient: 'Patient D', rating: 4.8, comment: 'Highly skilled doctor, excellent care.' },
        ],
    },
    {
    id: 'doc5',
    name: 'Dr. David Garcia',
    gender: 'Male',
    dateOfBirth: '1980-09-18',
    specialization: ['Pediatrics'],
    education: [
        { degree: 'MD', institution: 'Pediatric Medical College', year: 2005 },
        { degree: 'PhD', institution: 'Pediatric Research Institute', year: 2010 },
    ],
    contact: {
        email: 'david.garcia@example.com',
        phone: {
        primary: '+1 555-555-0009',
        secondary: '+1 555-555-0010',
        },
        address: {
        street: '789 Pine Street',
        city: 'City',
        state: 'State',
        zipCode: '45678',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 18,
        inSpecialty: 14,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Pediatrics', 'PALS Certified'],
    memberships: ['American Academy of Pediatrics', 'Pediatricians Association'],
    awards: ['Top Pediatrician of the Year 2016', 'Pediatric Excellence Award 2019'],
    researchInterests: ['Childhood Nutrition', 'Developmental Pediatrics'],
    reviews: [
        { patient: 'Patient E', rating: 4.9, comment: 'Amazing doctor, very caring.' },
        { patient: 'Patient F', rating: 5, comment: 'Great with kids, highly recommended!' },
    ],
    },
    {
    id: 'doc6',
    name: 'Dr. Emily Thompson',
    gender: 'Female',
    dateOfBirth: '1984-07-12',
    specialization: ['Dermatology'],
    education: [
        { degree: 'MD', institution: 'Dermatology College', year: 2009 },
        { degree: 'PhD', institution: 'Dermatology Research Institute', year: 2014 },
    ],
    contact: {
        email: 'emily.thompson@example.com',
        phone: {
        primary: '+1 555-555-0011',
        secondary: '+1 555-555-0012',
        },
        address: {
        street: '101 Cedar Street',
        city: 'City',
        state: 'State',
        zipCode: '56789',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 16,
        inSpecialty: 12,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: 'Not available',
        friday: '9:00 AM - 5:00 PM',
    },
    languages: ['English', 'French'],
    certifications: ['Board Certified in Dermatology', 'AAD Member'],
    memberships: ['American Academy of Dermatology', 'Dermatologists Association'],
    awards: ['Top Dermatologist of the Year 2017', 'Dermatology Excellence Award 2020'],
    researchInterests: ['Skin Cancer Prevention', 'Cosmetic Dermatology'],
    reviews: [
        { patient: 'Patient G', rating: 4.8, comment: 'Very skilled dermatologist, excellent results.' },
        { patient: 'Patient H', rating: 4.7, comment: 'Highly recommend, great bedside manner.' },
    ],
    },
    {
    id: 'doc7',
    name: 'Dr. Michael Brown',
    gender: 'Male',
    dateOfBirth: '1976-05-30',
    specialization: ['Orthopedic Surgery'],
    education: [
        { degree: 'MD', institution: 'Orthopedic College', year: 2001 },
        { degree: 'PhD', institution: 'Orthopedic Research Institute', year: 2006 },
    ],
    contact: {
        email: 'michael.brown@example.com',
        phone: {
        primary: '+1 555-555-0013',
        secondary: '+1 555-555-0014',
        },
        address: {
        street: '202 Maple Street',
        city: 'City',
        state: 'State',
        zipCode: '67890',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 24,
        inSpecialty: 18,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Orthopedic Surgery', 'ABOS Diplomate'],
    memberships: ['American Academy of Orthopedic Surgeons', 'Orthopedic Association'],
    awards: ['Top Orthopedic Surgeon of the Year 2015', 'Orthopedic Excellence Award 2018'],
    researchInterests: ['Joint Replacement', 'Sports Medicine'],
    reviews: [
        { patient: 'Patient I', rating: 4.9, comment: 'Excellent surgeon, very satisfied with outcome.' },
        { patient: 'Patient J', rating: 4.7, comment: 'Highly skilled doctor, compassionate care.' },
    ],
    },
    {
    id: 'doc8',
    name: 'Dr. Jennifer Wilson',
    gender: 'Female',
    dateOfBirth: '1981-12-22',
    specialization: ['Psychiatry'],
    education: [
        { degree: 'MD', institution: 'Psychiatry College', year: 2006 },
        { degree: 'PhD', institution: 'Psychiatry Research Institute', year: 2011 },
    ],
    contact: {
        email: 'jennifer.wilson@example.com',
        phone: {
        primary: '+1 555-555-0015',
        secondary: '+1 555-555-0016',
        },
        address: {
        street: '303 Oak Street',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 18,
        inSpecialty: 14,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Psychiatry', 'APA Member'],
    memberships: ['American Psychiatric Association', 'Psychiatrists Association'],
    awards: ['Top Psychiatrist of the Year 2019', 'Psychiatry Excellence Award 2021'],
    researchInterests: ['Mood Disorders', 'Psychopharmacology'],
    reviews: [
        { patient: 'Patient K', rating: 4.6, comment: 'Great psychiatrist, listens attentively.' },
        { patient: 'Patient L', rating: 4.8, comment: 'Highly recommend, very caring and understanding.' },
    ],
    },
    {
    id: 'doc9',
    name: 'Dr. Jessica Taylor',
    gender: 'Female',
    dateOfBirth: '1979-08-05',
    specialization: ['Radiology'],
    education: [
        { degree: 'MD', institution: 'Radiology College', year: 2004 },
        { degree: 'PhD', institution: 'Radiology Research Institute', year: 2009 },
    ],
    contact: {
        email: 'jessica.taylor@example.com',
        phone: {
        primary: '+1 555-555-0017',
        secondary: '+1 555-555-0018',
        },
        address: {
        street: '404 Walnut Street',
        city: 'City',
        state: 'State',
        zipCode: '23456',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 17,
        inSpecialty: 13,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'French'],
    certifications: ['Board Certified in Radiology', 'ACR Member'],
    memberships: ['American College of Radiology', 'Radiologists Association'],
    awards: ['Top Radiologist of the Year 2017', 'Radiology Excellence Award 2020'],
    researchInterests: ['Medical Imaging', 'Interventional Radiology'],
    reviews: [
        { patient: 'Patient M', rating: 4.7, comment: 'Very knowledgeable radiologist, excellent results.' },
        { patient: 'Patient N', rating: 4.9, comment: 'Highly skilled, compassionate care.' },
    ],
    },
    {
    id: 'doc10',
    name: 'Dr. William Lee',
    gender: 'Male',
    dateOfBirth: '1983-04-10',
    specialization: ['Urology'],
    education: [
        { degree: 'MD', institution: 'Urology College', year: 2008 },
        { degree: 'PhD', institution: 'Urology Research Institute', year: 2013 },
    ],
    contact: {
        email: 'william.lee@example.com',
        phone: {
        primary: '+1 555-555-0019',
        secondary: '+1 555-555-0020',
        },
        address: {
        street: '505 Chestnut Street',
        city: 'City',
        state: 'State',
        zipCode: '34567',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 15,
        inSpecialty: 12,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Urology', 'AUA Member'],
    memberships: ['American Urological Association', 'Urologists Association'],
    awards: ['Top Urologist of the Year 2018', 'Urology Excellence Award 2021'],
    researchInterests: ['Prostate Cancer', 'Reconstructive Urology'],
    reviews: [
        { patient: 'Patient O', rating: 4.8, comment: 'Great urologist, very thorough examination.' },
        { patient: 'Patient P', rating: 4.7, comment: 'Excellent doctor, highly recommend!' },
    ],
    },
    {
    id: 'doc11',
    name: 'Dr. Samantha Anderson',
    gender: 'Female',
    dateOfBirth: '1982-11-08',
    specialization: ['Gynecology'],
    education: [
        { degree: 'MD', institution: 'Gynecology College', year: 2007 },
        { degree: 'PhD', institution: 'Gynecology Research Institute', year: 2012 },
    ],
    contact: {
        email: 'samantha.anderson@example.com',
        phone: {
        primary: '+1 555-555-0021',
        secondary: '+1 555-555-0022',
        },
        address: {
        street: '606 Spruce Street',
        city: 'City',
        state: 'State',
        zipCode: '45678',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 16,
        inSpecialty: 13,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Gynecology', 'ACOG Fellow'],
    memberships: ['American College of Obstetricians and Gynecologists', 'Gynecologists Association'],
    awards: ['Top Gynecologist of the Year 2016', 'Gynecology Excellence Award 2019'],
    researchInterests: ['Women\'s Health', 'Minimally Invasive Surgery'],
    reviews: [
        { patient: 'Patient Q', rating: 4.7, comment: 'Very caring and compassionate gynecologist.' },
        { patient: 'Patient R', rating: 4.9, comment: 'Highly recommend, excellent care.' },
    ],
    },
    {
    id: 'doc12',
    name: 'Dr. Ethan Martinez',
    gender: 'Male',
    dateOfBirth: '1977-02-15',
    specialization: ['Oncology'],
    education: [
        { degree: 'MD', institution: 'Oncology College', year: 2002 },
        { degree: 'PhD', institution: 'Oncology Research Institute', year: 2007 },
    ],
    contact: {
        email: 'ethan.martinez@example.com',
        phone: {
        primary: '+1 555-555-0023',
        secondary: '+1 555-555-0024',
        },
        address: {
        street: '707 Oak Street',
        city: 'City',
        state: 'State',
        zipCode: '23456',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 19,
        inSpecialty: 16,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Oncology', 'ASCO Member'],
    memberships: ['American Society of Clinical Oncology', 'Oncologists Association'],
    awards: ['Top Oncologist of the Year 2017', 'Oncology Excellence Award 2020'],
    researchInterests: ['Cancer Immunotherapy', 'Precision Medicine'],
    reviews: [
        { patient: 'Patient S', rating: 4.8, comment: 'Highly skilled oncologist, compassionate care.' },
        { patient: 'Patient T', rating: 4.7, comment: 'Excellent doctor, very knowledgeable.' },
    ],
    },
    {
    id: 'doc13',
    name: 'Dr. Olivia Garcia',
    gender: 'Female',
    dateOfBirth: '1984-10-20',
    specialization: ['Endocrinology'],
    education: [
        { degree: 'MD', institution: 'Endocrinology College', year: 2009 },
        { degree: 'PhD', institution: 'Endocrinology Research Institute', year: 2014 },
    ],
    contact: {
        email: 'olivia.garcia@example.com',
        phone: {
        primary: '+1 555-555-0025',
        secondary: '+1 555-555-0026',
        },
        address: {
        street: '808 Maple Street',
        city: 'City',
        state: 'State',
        zipCode: '34567',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 17,
        inSpecialty: 13,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Endocrinology', 'AACE Member'],
    memberships: ['American Association of Clinical Endocrinologists', 'Endocrinologists Association'],
    awards: ['Top Endocrinologist of the Year 2018', 'Endocrinology Excellence Award 2021'],
    researchInterests: ['Diabetes Management', 'Thyroid Disorders'],
    reviews: [
        { patient: 'Patient U', rating: 4.7, comment: 'Very knowledgeable endocrinologist, excellent care.' },
        { patient: 'Patient V', rating: 4.9, comment: 'Highly recommend, compassionate and thorough.' },
    ],
    },
    {
    id: 'doc14',
    name: 'Dr. Noah Martinez',
    gender: 'Male',
    dateOfBirth: '1979-05-12',
    specialization: ['Cardiology'],
    education: [
        { degree: 'MD', institution: 'Cardiology College', year: 2004 },
        { degree: 'PhD', institution: 'Cardiology Research Institute', year: 2009 },
    ],
    contact: {
        email: 'noah.martinez@example.com',
        phone: {
        primary: '+1 555-555-0027',
        secondary: '+1 555-555-0028',
        },
        address: {
        street: '909 Elm Street',
        city: 'City',
        state: 'State',
        zipCode: '45678',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 18,
        inSpecialty: 15,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Cardiology', 'ACC Member'],
    memberships: ['American College of Cardiology', 'Cardiologists Association'],
    awards: ['Top Cardiologist of the Year 2017', 'Cardiology Excellence Award 2020'],
    researchInterests: ['Heart Disease Prevention', 'Cardiac Imaging'],
    reviews: [
        { patient: 'Patient W', rating: 4.8, comment: 'Excellent cardiologist, very thorough examination.' },
        { patient: 'Patient X', rating: 4.7, comment: 'Highly skilled doctor, compassionate care.' },
    ],
    },
    {
    id: 'doc15',
    name: 'Dr. Isabella Johnson',
    gender: 'Female',
    dateOfBirth: '1981-08-30',
    specialization: ['Dermatology'],
    education: [
        { degree: 'MD', institution: 'Dermatology College', year: 2006 },
        { degree: 'PhD', institution: 'Dermatology Research Institute', year: 2011 },
    ],
    contact: {
        email: 'isabella.johnson@example.com',
        phone: {
        primary: '+1 555-555-0029',
        secondary: '+1 555-555-0030',
        },
        address: {
        street: '1010 Pine Street',
        city: 'City',
        state: 'State',
        zipCode: '56789',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 16,
        inSpecialty: 13,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 1:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'French'],
    certifications: ['Board Certified in Dermatology', 'AAD Member'],
    memberships: ['American Academy of Dermatology', 'Dermatologists Association'],
    awards: ['Top Dermatologist of the Year 2018', 'Dermatology Excellence Award 2021'],
    researchInterests: ['Skin Cancer Prevention', 'Cosmetic Dermatology'],
    reviews: [
        { patient: 'Patient Y', rating: 4.9, comment: 'Great dermatologist, excellent results.' },
        { patient: 'Patient Z', rating: 4.8, comment: 'Highly recommend, very professional.' },
    ],
    },
    {
    id: 'doc16',
    name: 'Dr. Benjamin Thompson',
    gender: 'Male',
    dateOfBirth: '1983-11-22',
    specialization: ['Neurology'],
    education: [
        { degree: 'MD', institution: 'Neurology College', year: 2008 },
        { degree: 'PhD', institution: 'Neurology Research Institute', year: 2013 },
    ],
    contact: {
        email: 'benjamin.thompson@example.com',
        phone: {
        primary: '+1 555-555-0031',
        secondary: '+1 555-555-0032',
        },
        address: {
        street: '1111 Cedar Street',
        city: 'City',
        state: 'State',
        zipCode: '23456',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 15,
        inSpecialty: 12,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 1:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
    },
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified in Neurology', 'AAN Member'],
    memberships: ['American Academy of Neurology', 'Neurologists Association'],
    awards: ['Top Neurologist of the Year 2019', 'Neurology Excellence Award 2022'],
    researchInterests: ['Stroke Rehabilitation', 'Neurodegenerative Diseases'],
    reviews: [
        { patient: 'Patient AA', rating: 4.8, comment: 'Highly skilled neurologist, excellent care.' },
        { patient: 'Patient BB', rating: 4.7, comment: 'Great doctor, very attentive and thorough.' },
    ],
    },
    {
    id: 'doc17',
    name: 'Dr. Sophia Clark',
    gender: 'Female',
    dateOfBirth: '1978-06-17',
    specialization: ['Ophthalmology'],
    education: [
        { degree: 'MD', institution: 'Ophthalmology College', year: 2003 },
        { degree: 'PhD', institution: 'Ophthalmology Research Institute', year: 2008 },
    ],
    contact: {
        email: 'sophia.clark@example.com',
        phone: {
        primary: '+1 555-555-0033',
        secondary: '+1 555-555-0034',
        },
        address: {
        street: '1212 Elm Street',
        city: 'City',
        state: 'State',
        zipCode: '34567',
        country: 'Country',
        },
    },
    status: 'active',
    experience: {
        totalYears: 21,
        inSpecialty: 18,
    },
    schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: 'Not available',
    },
    languages: ['English', 'French'],
    certifications: ['Board Certified in Ophthalmology', 'AAO Fellow'],
    memberships: ['American Academy of Ophthalmology', 'Eye Physicians Association'],
    awards: ['Top Ophthalmologist of the Year 2017', 'Ophthalmology Excellence Award 2020'],
    researchInterests: ['Retina Disorders', 'Corneal Diseases'],
    reviews: [
        { patient: 'Patient CC', rating: 4.9, comment: 'Excellent ophthalmologist, highly skilled.' },
        { patient: 'Patient DD', rating: 4.7, comment: 'Highly recommend, great with patients.' },
    ],
    },
    {
    id: "doc18",
    name: "Dr. James White",
    gender: "Male",
    dateOfBirth: "1980-01-08",
    specialization: ["Pediatrics"],
    education: [
        { degree: "MD", institution: "Pediatric Medical College", year: 2005 },
        { degree: "PhD", institution: "Pediatric Research Institute", year: 2010 }
    ],
    contact: {
        email: "james.white@example.com",
        phone: {
        primary: "+1 555-555-0035",
        secondary: "+1 555-555-0036"
        },
        address: {
        street: "1313 Pine Street",
        city: "City",
        state: "State",
        zipCode: "45678",
        country: "Country"
        }
    },
    status: "active",
    experience: {
        totalYears: 19,
        inSpecialty: 15
    },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 1:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "Not available"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Pediatrics", "PALS Certified"],
    memberships: ["American Academy of Pediatrics", "Pediatricians Association"],
    awards: ["Top Pediatrician of the Year 2018", "Pediatric Excellence Award 2021"],
    researchInterests: ["Childhood Development", "Pediatric Immunology"],
    reviews: [
        { patient: "Patient EE", rating: 4.8, comment: "Great with kids, very caring pediatrician." },
        { patient: "Patient FF", rating: 4.9, comment: "Highly recommend, excellent care." }
    ]
    },
    {
    id: "doc19",
    name: "Dr. Lily Brown",
    gender: "Female",
    dateOfBirth: "1982-04-25",
    specialization: ["Psychiatry"],
    education: [
        { degree: "MD", institution: "Psychiatry College", year: 2007 },
        { degree: "PhD", institution: "Psychiatry Research Institute", year: 2012 }
    ],
    contact: {
        email: "lily.brown@example.com",
        phone: {
        primary: "+1 555-555-0037",
        secondary: "+1 555-555-0038"
        },
        address: {
        street: "1414 Oak Street",
        city: "City",
        state: "State",
        zipCode: "23456",
        country: "Country"
        }
    },
    status: "active",
    experience: {
        totalYears: 17,
        inSpecialty: 13
    },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 1:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Psychiatry", "APA Member"],
    memberships: ["American Psychiatric Association", "Psychiatrists Association"],
    awards: ["Top Psychiatrist of the Year 2016", "Psychiatry Excellence Award 2019"],
    researchInterests: ["Mood Disorders", "Psychopharmacology"],
    reviews: [
        { patient: "Patient GG", rating: 4.7, comment: "Very compassionate psychiatrist, excellent listener." },
        { patient: "Patient HH", rating: 4.9, comment: "Highly skilled, great treatment approach." }
    ]
    },
    {
    id: "doc20",
    name: "Dr. Lucas Johnson",
    gender: "Male",
    dateOfBirth: "1979-07-15",
    specialization: ["Radiology"],
    education: [
        { degree: "MD", institution: "Radiology College", year: 2004 },
        { degree: "PhD", institution: "Radiology Research Institute", year: 2009 }
    ],
    contact: {
        email: "lucas.johnson@example.com",
        phone: {
        primary: "+1 555-555-0039",
        secondary: "+1 555-555-0040"
        },
        address: {
        street: "1515 Cedar Street",
        city: "City",
        state: "State",
        zipCode: "34567",
        country: "Country"
        }
    },
    status: "active",
    experience: {
        totalYears: 20,
        inSpecialty: 16
    },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "Not available"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Radiology", "ACR Member"],
    memberships: ["American College of Radiology", "Radiologists Association"],
    awards: ["Top Radiologist of the Year 2018", "Radiology Excellence Award 2021"],
    researchInterests: ["Medical Imaging", "Interventional Radiology"],
    reviews: [
        { patient: "Patient II", rating: 4.8, comment: "Very knowledgeable radiologist, excellent care." },
        { patient: "Patient JJ", rating: 4.7, comment: "Highly recommend, very professional." }
    ]
    },
    {
        id: "doc21",
        name: "Dr. Mia Garcia",
        gender: "Female",
        dateOfBirth: "1985-03-20",
        specialization: ["Gynecology", "Obstetrics"],
        education: [
          { degree: "MD", institution: "Gynecology College", year: 2010 },
          { degree: "PhD", institution: "Obstetrics Research Institute", year: 2015 }
        ],
        contact: {
          email: "mia.garcia@example.com",
          phone: { primary: "+1 555-555-0041", secondary: "+1 555-555-0042" },
          address: {
            street: "1616 Elm Street",
            city: "City",
            state: "State",
            zipCode: "45678",
            country: "Country"
          }
        },
        status: "active",
        experience: { totalYears: 15, inSpecialty: 12 },
        schedule: {
          monday: "9:00 AM - 5:00 PM",
          tuesday: "9:00 AM - 5:00 PM",
          wednesday: "9:00 AM - 1:00 PM",
          thursday: "9:00 AM - 5:00 PM",
          friday: "Not available"
        },
        languages: ["English", "Spanish"],
        certifications: ["Board Certified in Gynecology", "ACOG Member"],
        memberships: ["American College of Obstetricians and Gynecologists", "Gynecologists Association"],
        awards: ["Top Gynecologist of the Year 2017", "Obstetrics Excellence Award 2020"],
        researchInterests: ["Women's Health", "Maternal-Fetal Medicine"],
        reviews: [
          { patient: "Patient KK", rating: 4.5, comment: "Great experience, highly recommend!" },
          { patient: "Patient LL", rating: 4.8, comment: "Very knowledgeable and caring." }
        ]
    },
    {
    id: "doc22",
    name: "Dr. Ethan Moore",
    gender: "Male",
    dateOfBirth: "1978-09-10",
    specialization: ["Orthopedic Surgery", "Sports Medicine"],
    education: [
        { degree: "MD", institution: "Orthopedic Medical School", year: 2003 },
        { degree: "Fellowship", institution: "Sports Medicine Institute", year: 2008 }
    ],
    contact: {
        email: "ethan.moore@example.com",
        phone: { primary: "+1 555-555-0043", secondary: "+1 555-555-0044" },
        address: {
        street: "2121 Oak Street",
        city: "City",
        state: "State",
        zipCode: "56789",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 18, inSpecialty: 15 },
    schedule: {
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "Not available",
        thursday: "9:00 AM - 6:00 PM",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Orthopedic Surgery", "Sports Medicine Certification"],
    memberships: ["American Academy of Orthopedic Surgeons", "American Orthopedic Society for Sports Medicine"],
    awards: ["Top Orthopedic Surgeon of the Year 2018", "Sports Medicine Achievement Award 2021"],
    researchInterests: ["Orthopedic Injury Prevention", "Regenerative Medicine"],
    reviews: [
        { patient: "Patient MM", rating: 4.7, comment: "Excellent surgeon, helped me recover quickly." },
        { patient: "Patient NN", rating: 4.9, comment: "Very skilled, great bedside manner." }
    ]
    },
    {
    id: "doc23",
    name: "Dr. Sofia Anderson",
    gender: "Female",
    dateOfBirth: "1980-12-05",
    specialization: ["Radiology", "Diagnostic Imaging"],
    education: [
        { degree: "MD", institution: "Radiology Medical College", year: 2005 },
        { degree: "Fellowship", institution: "Diagnostic Imaging Hospital", year: 2010 }
    ],
    contact: {
        email: "sofia.anderson@example.com",
        phone: { primary: "+1 555-555-0045", secondary: "+1 555-555-0046" },
        address: {
        street: "3030 Maple Street",
        city: "City",
        state: "State",
        zipCode: "67890",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 16, inSpecialty: 12 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "Not available",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Radiology", "Diagnostic Imaging Specialist"],
    memberships: ["Radiological Society of North America", "American College of Radiology"],
    awards: ["Top Radiologist of the Year 2019", "Diagnostic Imaging Excellence Award 2022"],
    researchInterests: ["Advanced Imaging Techniques", "Radiation Safety"],
    reviews: [
        { patient: "Patient OO", rating: 4.6, comment: "Very thorough, explained results clearly." },
        { patient: "Patient PP", rating: 4.8, comment: "Highly recommend for accurate diagnostics." }
    ]
    },
    {
    id: "doc24",
    name: "Dr. Noah Martinez",
    gender: "Male",
    dateOfBirth: "1975-07-15",
    specialization: ["Urology", "Andrology"],
    education: [
        { degree: "MD", institution: "Urology Medical School", year: 2000 },
        { degree: "Fellowship", institution: "Andrology Institute", year: 2005 }
    ],
    contact: {
        email: "noah.martinez@example.com",
        phone: { primary: "+1 555-555-0047", secondary: "+1 555-555-0048" },
        address: {
        street: "4040 Pine Street",
        city: "City",
        state: "State",
        zipCode: "78901",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 21, inSpecialty: 18 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "Not available",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Urology", "Andrology Specialist"],
    memberships: ["American Urological Association", "International Society for Sexual Medicine"],
    awards: ["Top Urologist of the Year 2017", "Andrology Excellence Award 2020"],
    researchInterests: ["Male Infertility", "Prostate Health"],
    reviews: [
        { patient: "Patient QQ", rating: 4.7, comment: "Very skilled and professional." },
        { patient: "Patient RR", rating: 4.9, comment: "Excellent care, highly satisfied." }
    ]
    },
    {
    id: "doc25",
    name: "Dr. Ava Taylor",
    gender: "Female",
    dateOfBirth: "1976-05-20",
    specialization: ["Gastroenterology", "Hepatology"],
    education: [
        { degree: "MD", institution: "Gastroenterology College", year: 2001 },
        { degree: "Fellowship", institution: "Hepatology Center", year: 2006 }
    ],
    contact: {
        email: "ava.taylor@example.com",
        phone: { primary: "+1 555-555-0049", secondary: "+1 555-555-0050" },
        address: {
        street: "5050 Elm Street",
        city: "City",
        state: "State",
        zipCode: "89012",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 20, inSpecialty: 17 },
    schedule: {
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "Not available"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Gastroenterology", "Hepatology Specialist"],
    memberships: ["American Gastroenterological Association", "American Association for the Study of Liver Diseases"],
    awards: ["Top Gastroenterologist of the Year 2018", "Hepatology Excellence Award 2021"],
    researchInterests: ["Digestive Diseases", "Liver Transplantation"],
    reviews: [
        { patient: "Patient SS", rating: 4.6, comment: "Very knowledgeable and caring." },
        { patient: "Patient TT", rating: 4.8, comment: "Excellent doctor, great communicator." }
    ]
    },
    {
    id: "doc26",
    name: "Dr. Daniel White",
    gender: "Male",
    dateOfBirth: "1980-11-25",
    specialization: ["Oncology", "Hematology"],
    education: [
        { degree: "MD", institution: "Oncology Medical College", year: 2005 },
        { degree: "Fellowship", institution: "Hematology Institute", year: 2010 }
    ],
    contact: {
        email: "daniel.white@example.com",
        phone: { primary: "+1 555-555-0051", secondary: "+1 555-555-0052" },
        address: {
        street: "6060 Oak Street",
        city: "City",
        state: "State",
        zipCode: "90123",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 16, inSpecialty: 13 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 1:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "Not available"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Oncology", "Hematology Specialist"],
    memberships: ["American Society of Clinical Oncology", "American Society of Hematology"],
    awards: ["Top Oncologist of the Year 2019", "Hematology Excellence Award 2022"],
    researchInterests: ["Cancer Immunotherapy", "Blood Disorders"],
    reviews: [
        { patient: "Patient UU", rating: 4.7, comment: "Compassionate care, highly recommended." },
        { patient: "Patient VV", rating: 4.9, comment: "Great oncologist, helped me through treatment." }
    ]
    },
    {
    id: "doc27",
    name: "Dr. Chloe Brown",
    gender: "Female",
    dateOfBirth: "1979-07-10",
    specialization: ["Endocrinology", "Metabolism"],
    education: [
        { degree: "MD", institution: "Endocrinology College", year: 2004 },
        { degree: "Fellowship", institution: "Metabolism Center", year: 2009 }
    ],
    contact: {
        email: "chloe.brown@example.com",
        phone: { primary: "+1 555-555-0053", secondary: "+1 555-555-0054" },
        address: {
        street: "7070 Pine Street",
        city: "City",
        state: "State",
        zipCode: "12345",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 17, inSpecialty: 14 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "Not available",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Endocrinology", "Metabolism Specialist"],
    memberships: ["Endocrine Society", "American Association of Clinical Endocrinologists"],
    awards: ["Top Endocrinologist of the Year 2018", "Metabolism Excellence Award 2021"],
    researchInterests: ["Diabetes Management", "Thyroid Disorders"],
    reviews: [
        { patient: "Patient WW", rating: 4.6, comment: "Very thorough and knowledgeable." },
        { patient: "Patient XX", rating: 4.8, comment: "Excellent care, helped me manage my condition." }
    ]
    },
    {
    id: "doc28",
    name: "Dr. Oliver Rodriguez",
    gender: "Male",
    dateOfBirth: "1977-12-15",
    specialization: ["Pulmonology", "Critical Care Medicine"],
    education: [
        { degree: "MD", institution: "Pulmonology Medical College", year: 2002 },
        { degree: "Fellowship", institution: "Critical Care Institute", year: 2007 }
    ],
    contact: {
        email: "oliver.rodriguez@example.com",
        phone: { primary: "+1 555-555-0055", secondary: "+1 555-555-0056" },
        address: {
        street: "8080 Elm Street",
        city: "City",
        state: "State",
        zipCode: "23456",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 19, inSpecialty: 16 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "Not available",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Pulmonology", "Critical Care Medicine Specialist"],
    memberships: ["American Thoracic Society", "Society of Critical Care Medicine"],
    awards: ["Top Pulmonologist of the Year 2017", "Critical Care Excellence Award 2020"],
    researchInterests: ["Respiratory Diseases", "Ventilator Management"],
    reviews: [
        { patient: "Patient YY", rating: 4.7, comment: "Very caring and attentive." },
        { patient: "Patient ZZ", rating: 4.9, comment: "Excellent pulmonologist, highly recommended." }
    ]
    },
    {
    id: "doc29",
    name: "Dr. Harper Scott",
    gender: "Male",
    dateOfBirth: "1976-09-20",
    specialization: ["Rheumatology", "Autoimmune Diseases"],
    education: [
        { degree: "MD", institution: "Rheumatology College", year: 2001 },
        { degree: "Fellowship", institution: "Autoimmune Diseases Center", year: 2006 }
    ],
    contact: {
        email: "harper.scott@example.com",
        phone: { primary: "+1 555-555-0057", secondary: "+1 555-555-0058" },
        address: {
        street: "9090 Oak Street",
        city: "City",
        state: "State",
        zipCode: "34567",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 20, inSpecialty: 17 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "Not available",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Rheumatology", "Autoimmune Diseases Specialist"],
    memberships: ["American College of Rheumatology", "International Society for Rheumatic Diseases"],
    awards: ["Top Rheumatologist of the Year 2019", "Autoimmune Diseases Excellence Award 2022"],
    researchInterests: ["Inflammatory Arthritis", "Systemic Lupus Erythematosus"],
    reviews: [
        { patient: "Patient AAA", rating: 4.6, comment: "Very knowledgeable, explained condition well." },
        { patient: "Patient BBB", rating: 4.8, comment: "Excellent rheumatologist, helped manage symptoms effectively." }
    ]
    },
    {
    id: "doc30",
    name: "Dr. Riley Adams",
    gender: "Male",
    dateOfBirth: "1979-08-25",
    specialization: ["Neurosurgery", "Spine Surgery"],
    education: [
        { degree: "MD", institution: "Neurosurgery Medical College", year: 2004 },
        { degree: "Fellowship", institution: "Spine Surgery Institute", year: 2009 }
    ],
    contact: {
        email: "riley.adams@example.com",
        phone: { primary: "+1 555-555-0059", secondary: "+1 555-555-0060" },
        address: {
        street: "1010 Pine Street",
        city: "City",
        state: "State",
        zipCode: "45678",
        country: "Country"
        }
    },
    status: "active",
    experience: { totalYears: 17, inSpecialty: 14 },
    schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "Not available",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM"
    },
    languages: ["English", "Spanish"],
    certifications: ["Board Certified in Neurosurgery", "Spine Surgery Specialist"],
    memberships: ["American Association of Neurological Surgeons", "North American Spine Society"],
    awards: ["Top Neurosurgeon of the Year 2018", "Spine Surgery Excellence Award 2021"],
    researchInterests: ["Minimally Invasive Spine Surgery", "Neurological Trauma"],
    reviews: [
        { patient: "Patient CCC", rating: 4.7, comment: "Highly skilled surgeon, excellent outcomes." },
        { patient: "Patient DDD", rating: 4.9, comment: "Great bedside manner, very caring." }
    ]
    }
      
  ];

module.exports = doctorRecords;