import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon,
  CalendarMonth as CalendarIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { Itinerary } from '../../types';
import { exportToPDF, exportToCalendar, generateShareableLink, saveForOfflineAccess } from '../../services/ExportService';

interface ExportOptionsProps {
  itinerary: Itinerary;
  open: boolean;
  onClose: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ itinerary, open, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleExportPDF = async () => {
    try {
      setLoading('pdf');
      const url = await exportToPDF(itinerary);
      setPdfUrl(url);
      setLoading(null);
      
      // In a real app, we would trigger the download automatically
      // For now, we'll just show a success message
      setSnackbar({
        open: true,
        message: 'PDF generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      setLoading(null);
      setSnackbar({
        open: true,
        message: 'Failed to generate PDF',
        severity: 'error'
      });
    }
  };

  const handleExportCalendar = async () => {
    try {
      setLoading('calendar');
      const url = await exportToCalendar(itinerary);
      setCalendarUrl(url);
      setLoading(null);
      
      setSnackbar({
        open: true,
        message: 'Calendar file generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to calendar:', error);
      setLoading(null);
      setSnackbar({
        open: true,
        message: 'Failed to generate calendar file',
        severity: 'error'
      });
    }
  };

  const handleGenerateShareableLink = async () => {
    try {
      setLoading('share');
      const link = await generateShareableLink(itinerary);
      setShareableLink(link);
      setLoading(null);
      
      setSnackbar({
        open: true,
        message: 'Shareable link generated!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating shareable link:', error);
      setLoading(null);
      setSnackbar({
        open: true,
        message: 'Failed to generate shareable link',
        severity: 'error'
      });
    }
  };

  const handleSaveOffline = async () => {
    try {
      setLoading('offline');
      await saveForOfflineAccess(itinerary);
      setLoading(null);
      
      setSnackbar({
        open: true,
        message: 'Itinerary saved for offline access!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving for offline access:', error);
      setLoading(null);
      setSnackbar({
        open: true,
        message: 'Failed to save for offline access',
        severity: 'error'
      });
    }
  };

  const handleCopyLink = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Link copied to clipboard!',
            severity: 'success'
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: 'Failed to copy link',
            severity: 'error'
          });
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Export & Share Itinerary</DialogTitle>
        <DialogContent>
          <List>
            {/* Export as PDF */}
            <ListItem>
              <ListItemIcon>
                <PdfIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Export as PDF" 
                secondary="Download a PDF version of your itinerary"
              />
              <Button
                variant="outlined"
                startIcon={loading === 'pdf' ? <CircularProgress size={20} /> : <DownloadIcon />}
                onClick={handleExportPDF}
                disabled={loading !== null}
              >
                {pdfUrl ? 'Download' : 'Generate'}
              </Button>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Export to Calendar */}
            <ListItem>
              <ListItemIcon>
                <CalendarIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Add to Calendar" 
                secondary="Export to Google Calendar or Apple Calendar (ICS file)"
              />
              <Button
                variant="outlined"
                startIcon={loading === 'calendar' ? <CircularProgress size={20} /> : <CalendarIcon />}
                onClick={handleExportCalendar}
                disabled={loading !== null}
              >
                {calendarUrl ? 'Download' : 'Generate'}
              </Button>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Generate Shareable Link */}
            <ListItem>
              <ListItemIcon>
                <ShareIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Share with Friends" 
                secondary="Generate a link that can be shared with others"
              />
              {!shareableLink ? (
                <Button
                  variant="outlined"
                  startIcon={loading === 'share' ? <CircularProgress size={20} /> : <ShareIcon />}
                  onClick={handleGenerateShareableLink}
                  disabled={loading !== null}
                >
                  Generate Link
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={shareableLink}
                    InputProps={{
                      readOnly: true,
                      sx: { width: '200px' }
                    }}
                  />
                  <Tooltip title="Copy link">
                    <IconButton onClick={handleCopyLink}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Save for Offline Access */}
            <ListItem>
              <ListItemIcon>
                <SaveIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Save for Offline Access" 
                secondary="Access your itinerary even without internet connection"
              />
              <Button
                variant="outlined"
                startIcon={loading === 'offline' ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveOffline}
                disabled={loading !== null}
              >
                Save Offline
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportOptions;