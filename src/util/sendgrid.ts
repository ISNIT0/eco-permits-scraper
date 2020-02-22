import sgMail from '@sendgrid/mail';
import { config } from 'src/config';

sgMail.setApiKey(config.sendgrid.apiKey);

export { sgMail };
