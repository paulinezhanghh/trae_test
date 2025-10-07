import { Itinerary, ItineraryItem, DailyItinerary, Activity } from '../types';
import { format } from 'date-fns';

// Export itinerary as PDF
export const exportToPDF = async (itinerary: Itinerary): Promise<string> => {
  try {
    // In a real application, we would use a library like jsPDF or pdfmake
    // For now, we'll simulate PDF generation
    
    console.log('Exporting itinerary to PDF:', itinerary.id);
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock PDF URL (in a real app, this would be a Blob URL or download link)
    return `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDM4Pj5zdHJlYW0KeJwr5HIK4TI2UzC0NFMISeFyDeEK5OICADFMBRkKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8L0NvbnRlbnRzIDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDYgMCBSPj4+Pi9UcmltQm94WzAgMCA1OTUgODQyXS9UeXBlL1BhZ2U+PgplbmRvYmoKMSAwIG9iago8PC9QYWdlcyAyIDAgUi9UeXBlL0NhdGFsb2c+PgplbmRvYmoKMyAwIG9iago8PC9BdXRob3IoVHJpcGx5KS9DcmVhdGlvbkRhdGUoRDoyMDIzMDUxNTEyMDAwMFopL0NyZWF0b3IoVHJpcGx5KS9LZXl3b3JkcyhpdgplcmFyeSwgdHJhdmVsKS9Nb2REYXRlKEQ6MjAyMzA1MTUxMjAwMDBaKS9Qcm9kdWNlcihUcmlwbHkpL1N1YmplY3QoVHJhdmVsIEl0aW5lcmFyeSkvVGl0bGUoVHJpcGx5IEl0aW5lcmFyeSk+PgplbmRvYmoKMiAwIG9iago8PC9Db3VudCAxL0tpZHNbNCAwIFJdL1R5cGUvUGFnZXM+PgplbmRvYmoKNiAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL1N1YnR5cGUvVHlwZTEvVHlwZS9Gb250Pj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDIyMiAwMDAwMCBuIAowMDAwMDAwNTQ0IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKMDAwMDAwMDExOSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDA1OTUgMDAwMDAgbiAKdHJhaWxlcgo8PC9JRFs8MjhiZjRlNWUxZGIzODQxOTc2N2QzYjY0M2EwNmFhZTg+PDI4YmY0ZTVlMWRiMzg0MTk3NjdkM2I2NDNhMDZhYWU4Pl0vSW5mbwozIDAgUi9Sb290IDEgMCBSL1NpemUgNz4+CnN0YXJ0eHJlZgo2OTIKJSVFT0YK`;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export itinerary to PDF');
  }
};

// Export itinerary to calendar (ICS format)
export const exportToCalendar = async (itinerary: Itinerary): Promise<string> => {
  try {
    // Generate ICS content
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Triply//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];
    
    // Add events for each activity
    itinerary.days.forEach((day: DailyItinerary) => {
      day.items.forEach((item: ItineraryItem) => {
        const activity = item.activity;
        const startDate = formatDateForICS(new Date(item.startTime));
        const endDate = formatDateForICS(new Date(item.endTime));
        
        icsContent = [
          ...icsContent,
          'BEGIN:VEVENT',
          `UID:${activity.id}@triply.app`,
          `DTSTAMP:${formatDateForICS(new Date())}`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          `SUMMARY:${activity.name}`,
          `DESCRIPTION:${activity.description || ''}`,
          `LOCATION:${activity.address || ''}`,
          'END:VEVENT',
        ];
      });
    });
    
    // Close calendar
    icsContent.push('END:VCALENDAR');
    
    // Join with CRLF as required by ICS spec
    const icsData = icsContent.join('\r\n');
    
    // In a real app, we would create a downloadable file
    // For now, return a data URL
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsData)}`;
  } catch (error) {
    console.error('Error exporting to calendar:', error);
    throw new Error('Failed to export itinerary to calendar');
  }
};

// Generate a shareable link for the itinerary
export const generateShareableLink = async (itinerary: Itinerary): Promise<string> => {
  try {
    // In a real application, we would save the itinerary to a database
    // and generate a unique URL with an access token
    
    // For now, we'll simulate this by encoding the itinerary ID
    const shareId = btoa(`triply-share-${itinerary.id}-${Date.now()}`);
    
    // Return a mock shareable URL
    return `https://triply.app/share/${shareId}`;
  } catch (error) {
    console.error('Error generating shareable link:', error);
    throw new Error('Failed to generate shareable link');
  }
};

// Helper function to format dates for ICS
const formatDateForICS = (date: Date): string => {
  // Format: 20210101T120000Z (YYYYMMDDTHHMMSSZ)
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

// Save itinerary for offline access
export const saveForOfflineAccess = async (itinerary: Itinerary): Promise<void> => {
  try {
    // In a real application, we would use IndexedDB or localStorage
    // For now, we'll simulate saving to localStorage
    
    const savedItineraries = JSON.parse(localStorage.getItem('triply-itineraries') || '[]');
    
    // Check if itinerary already exists
    const existingIndex = savedItineraries.findIndex((saved: Itinerary) => saved.id === itinerary.id);
    
    if (existingIndex >= 0) {
      // Update existing itinerary
      savedItineraries[existingIndex] = itinerary;
    } else {
      // Add new itinerary
      savedItineraries.push(itinerary);
    }
    
    // Save back to localStorage
    localStorage.setItem('triply-itineraries', JSON.stringify(savedItineraries));
    
    console.log('Itinerary saved for offline access:', itinerary.id);
  } catch (error) {
    console.error('Error saving itinerary for offline access:', error);
    throw new Error('Failed to save itinerary for offline access');
  }
};