import { createRouter } from 'next-connect';
import multer from 'multer';
import { UPLOAD_DIRECTORY } from '../../config'; // Adjust the path as necessary


// Configure multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  }),
});

//@ts-ignore
const apiRoute = createRouter({
  onError: (err, req, res) => {
    res.status(500).json({ error: `Something went wrong! ${err.message}` });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req: any, res: any) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

export default apiRoute.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};