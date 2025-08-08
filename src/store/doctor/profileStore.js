import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { showProfile, editProfile } from '../../api/doctor/profile'; // Adjust the import path

export const useProfileStore = create(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        loading: false,
        error: null,
        
        // Fetch doctor profile
        fetchProfile: async () => {
          set({ loading: true, error: null });
          try {
            const profileData = await showProfile();
            set({ 
              profile: profileData,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error.message || 'Failed to fetch profile',
              loading: false 
            });
            throw error;
          }
        },
        
        // Update doctor profile
        updateProfile: async (formData) => {
          set({ loading: true, error: null });
          try {
            // Transform form data to match API payload structure
            const payload = {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              speciality: formData.speciality,
              professional_title: formData.professionalTitle,
              experience: formData.experienceYears,
              booking_type: formData.bookType,
              status: formData.status,
              visit_fee: formData.visitFee,
              average_visit_duration: `${formData.visitDuration} min`,
              sign: formData.signature?.[0]?.originFileObj,
              photo: formData.profileImage?.[0]?.originFileObj,
              ...(formData.newPassword && {
                password: formData.newPassword,
                password_confirmation: formData.confirmPassword,
                old_password: formData.oldPassword
              })
            };

            // Create FormData object for file uploads
            const apiFormData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                apiFormData.append(key, value);
              }
            });

            const updatedProfile = await editProfile(apiFormData);
            set({ 
              profile: updatedProfile,
              loading: false 
            });
            return updatedProfile;
          } catch (error) {
            set({ 
              error: error.message || 'Failed to update profile',
              loading: false 
            });
            throw error;
          }
        },
        // Clear profile data
        clearProfile: () => {
          set({ 
            profile: null,
            error: null
          });
        },
        
        // Get initial form values from profile
        getInitialFormValues: () => {
          const { profile } = get();
          if (!profile) return {};
          
          return {
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            professionalTitle: profile.professional_title || '',
            speciality: profile.speciality || '',
            experienceYears: profile.experience || '',
            bookType: profile.booking_type || 'auto',
            status: profile.status || 'available',
            visitFee: profile.visit_fee || '',
            visitDuration: parseInt(profile.average_visit_duration),
          };
        }
      }),
      {
        name: 'doctor-profile-storage',
        partialize: (state) => ({ profile: state.profile })
      }
    )
  )
);