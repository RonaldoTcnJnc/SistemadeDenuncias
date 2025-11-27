import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: 'Lucía Méndez',
    role: 'DIAT',
    district: 'Distrito Norte',
    bio: 'Responsable de coordinar las acciones municipales y atención de denuncias en su distrito.',
    avatar: 'LM',
    avatarImage: null,
    email: 'lucia.mendez@diat.gob.pe',
    phone: '+51 1 4445678'
  });

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile debe ser usado dentro de ProfileProvider');
  }
  return context;
};
