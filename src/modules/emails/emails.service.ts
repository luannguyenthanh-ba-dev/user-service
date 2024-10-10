import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EMAILS_DOWNLOAD_SCHEMA } from './emails.const';
import { Model } from 'mongoose';
import { IEmailsDownloadModel } from './interfaces/emails-download.model.interface';
// const mailchimpMkt = require('@mailchimp/mailchimp_marketing');

import {
  IDownloadEmailFilters,
  IDownloadEmailInput,
} from './interfaces/emails.interface';

/**
 * Marketing email: This one is pretty self-explanatory. Use a marketing email API when you want to send an email blast
 * to a large group of users. Most marketing email services will provide tools to help you market effectively, like the
 * ability to target emails to certain cohorts of users. Marketing email services allow you to send tens of thousands
 * of emails efficiently and cost-effectively.
 * -----------------------------------------------------------------------------------------------------------------
 * Transactional email: Use a transactional email API whenever you want to send an email to a single user. You'll use
 * transactional email for things like email verification, password resets, and user-specific notifications like order
 * confirmations. Transactional email services should generally not be used for sending emails in bulk, since they cost
 * more per message than marketing email services and may have stricter rate limits.
 */
@Injectable()
export class EmailsService {
  private logger: Logger = new Logger(EmailsService.name);
  private mailchimpTx: any;
  private emailForDownload: string;

  constructor(
    @InjectModel(EMAILS_DOWNLOAD_SCHEMA)
    private readonly emailsDownloadModel: Model<IEmailsDownloadModel>,
  ) {
    this.emailForDownload =
      process.env.FROM_EMAIL_FOR_DOWNLOAD || 'example.email@gmail.com';
  }

  async onModuleInit(): Promise<void> {
    const logger = this.logger;
    // TODO: Mkt Mailchimp
    // mailchimpMkt.setConfig({
    //   apiKey: process.env.MAILCHIMP_SERVICE_API_KEY,
    //   server: process.env.MAILCHIMP_SERVICE_SERVER_PREFIX,
    // });
    // async function pingToMailchimpService() {
    //   try {
    //     const response = await mailchimp.ping.get();
    //     logger.debug(`Ping to Mailchimp: ${response.health_status}`);
    //   } catch (error) {
    //     logger.error(`Ping to Mailchimp: ${error.message}`);
    //   }
    // }

    // Transaction Mailchimp
    this.mailchimpTx = require('@mailchimp/mailchimp_transactional')(
      process.env.MAILCHIMP_TRANSACTION_SERVICE_API_KEY,
    );

    async function pingToMailchimpService(mailchimpTx) {
      try {
        const response = await mailchimpTx.users.ping();
        logger.debug(`Ping to Mailchimp: ${response}`);
      } catch (error) {
        logger.error(`Ping to Mailchimp: ${error.message}`);
      }
    }

    pingToMailchimpService(this.mailchimpTx);
  }

  async upsertEmailDownload(data: IDownloadEmailInput) {
    const result = await this.emailsDownloadModel.findOneAndUpdate(
      { client: data.client },
      data,
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
    return result;
  }

  async findOneEmailDownload(filters: IDownloadEmailFilters) {
    const conditions: any = {};
    if (filters._id) {
      conditions._id = filters._id;
    }
    if (filters.client) {
      conditions.client = filters.client;
    }
    if (filters.link) {
      conditions.link = filters.link;
    }

    const result = await this.emailsDownloadModel.findOne(conditions);
    return result;
  }

  /**
   * Handle send email download
   * @param data
   */
  async sendEmailDownload(client: any, link: string) {
    const emailDownload = await this.emailsDownloadModel.findOne({
      client: client._id,
    });
    // Send new download email - 1 minute | 1 mail | 1 client
    console.log(Math.floor(Date.now() / 1000) - emailDownload.timestamp);
    if (
      emailDownload &&
      Math.floor(Date.now() / 1000) - emailDownload.timestamp <= 60
    ) {
      throw new NotAcceptableException(
        'We can only send download email one time per minute for this client',
      );
    }

    // SEND MAIL
    const message = {
      from_email: this.emailForDownload,
      from_name: 'AI For Study',
      subject: 'AI For Study Starter Kit <<Download Link>>',
      text: `
      Hi ${client.name},
      Thank you for signing up to Alfor.study! We're excited to have you on board as you begin your Al journey.
      
      Here's your exclusive download link for the Alfor.study Starter Platform:
      [Download Al Starter Kit]: ${link}
      
      This platform includes:
      1. A step-by-step guide to creating your first Al model.
      2. Pre-built templates for image classification.
      3. Access to free datasets in our marketplace.
      4. Resources to help you monetize your Al creations.
      If you have any questions or need support, feel free to contact us at [Support Email]. We're here to help you succeed!
      
      Stay tuned for more updates, tutorials, and success stories coming your way.
      
      Best regards,
      The Alfor.study Team
      `,
      to: [
        {
          email: client.email,
          type: 'to',
        },
      ],
    };
    try {
      const response = await this.mailchimpTx.messages.send({
        message,
      });
      this.logger.log(
        `Send email download success ${JSON.stringify(response)}`,
      );
      // Trace email download
      await this.upsertEmailDownload({
        client: client._id,
        link: link,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Send email download to ${client.email} met error: ${error.message}`,
      );
    }
  }
}
