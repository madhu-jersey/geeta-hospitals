export type ImageRecord = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  placeholder?: boolean;
};

export const heroImage = {
  id: 'hero',
  src: '/assets/hero-building.jpg',
  alt: 'Geeta Hospitals building, Tanuku',
};

export const galleryImages: ImageRecord[] = [
  { id: 'ultrasound-bed', src: '/assets/gallery/ultrasound-bed.jpg', alt: 'Examination bed and ultrasound equipment in a consultation room at Geeta Hospitals', caption: 'Consultation room', category: 'Consultation room' },
  { id: 'eye-check', src: '/assets/gallery/eye-check.jpg', alt: 'Patients having eye checks with staff in a consultation room at Geeta Hospitals', caption: 'Consultation room', category: 'Consultation room' },
  { id: 'eye-examination', src: '/assets/gallery/eye-examination.jpg', alt: 'Eye examination chair and equipment in a consultation room at Geeta Hospitals', caption: 'Consultation room', category: 'Consultation room' },
  { id: 'hospital-building', src: '/assets/gallery/hospital-building.jpg', alt: 'Geeta Hospitals building with its Telugu name board', caption: 'Building', category: 'Building' },
  { id: 'patient-room', src: '/assets/gallery/patient-room.jpg', alt: 'Two beds and privacy curtains in a hospital room at Geeta Hospitals', caption: 'Building', category: 'Building' },
  { id: 'ultrasound-machine', src: '/assets/gallery/ultrasound-machine.jpg', alt: 'Ultrasound machine on wheels in a hospital room at Geeta Hospitals', caption: 'Building', category: 'Building' },
  { id: 'hospital-entrance', src: '/assets/gallery/hospital-entrance.jpg', alt: 'Geeta Hospitals entrance with Telugu signage above the doorway', caption: 'Building', category: 'Building' },
  { id: 'operating-theatre', src: '/assets/gallery/operating-theatre.jpg', alt: 'Operating table and medical equipment in a hospital room at Geeta Hospitals', caption: 'Building', category: 'Building' },
  { id: 'radiant-warmer', src: '/assets/gallery/radiant-warmer.jpg', alt: 'Radiant warmer and bedside equipment in a hospital room at Geeta Hospitals', caption: 'Building', category: 'Building' },
  { id: 'eye-operating-room', src: '/assets/gallery/eye-operating-room.jpg', alt: 'Operating table and overhead lights in a hospital room at Geeta Hospitals', caption: 'Building', category: 'Building' },
  { id: 'reception-desk', src: '/assets/gallery/reception-desk.jpg', alt: 'Reception desk with staff and a Consultation Rooms sign at Geeta Hospitals', caption: 'Reception', category: 'Reception' },
  { id: 'ophthalmology-room', src: '/assets/gallery/ophthalmology-room.jpg', alt: 'Eye examination chair and ophthalmology equipment in a consultation room at Geeta Hospitals', caption: 'Consultation room', category: 'Consultation room' },
  { id: 'eye-treatment-room', src: '/assets/gallery/eye-treatment-room.jpg', alt: 'Eye examination equipment and treatment chair in a consultation room at Geeta Hospitals', caption: 'Consultation room', category: 'Consultation room' },
];

export const galleryPlaceholders: ImageRecord[] = [
  { id: 'placeholder-building', src: '', alt: '', caption: 'Building', category: 'Building', placeholder: true },
  { id: 'placeholder-reception', src: '', alt: '', caption: 'Reception', category: 'Reception', placeholder: true },
  { id: 'placeholder-consultation', src: '', alt: '', caption: 'Consultation room', category: 'Consultation room', placeholder: true },
  { id: 'placeholder-waiting', src: '', alt: '', caption: 'Waiting area', category: 'Waiting area', placeholder: true },
  { id: 'placeholder-laboratory', src: '', alt: '', caption: 'Laboratory', category: 'Laboratory', placeholder: true },
];

export const doctorImages: Record<string, ImageRecord> = {
  bhuvanasri: { id: 'bhuvanasri', src: '/assets/doctors/bhuvanasri.jpg', alt: 'Portrait of Dr. P. Bhuvanasri', caption: 'Portrait to be added', category: 'doctor' },
  meghana: { id: 'meghana', src: '/assets/doctors/meghana-reddy.jpg', alt: 'Portrait of Dr. D. Meghana Reddy', caption: 'Portrait to be added', category: 'doctor' },
  aditya: { id: 'aditya', src: '/assets/doctors/aditya-reddy.jpg', alt: 'Portrait of Dr. V. Aditya Reddy', caption: 'Portrait to be added', category: 'doctor' },
  srinivasa: { id: 'srinivasa', src: '/assets/doctors/srinivasa-reddy.png', alt: 'Portrait of Dr. V.T. Srinivasa Reddy', caption: 'Portrait to be added', category: 'doctor' },
};
