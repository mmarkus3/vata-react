import { Controller, Get, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {

  constructor(private campaignsService: CampaignsService) { }

  @Get('company/:company/campaign/:code')
  getCampaign(@Param('company') companyId: string, @Param('code') code: string) {
    return this.campaignsService.getCampaignByCodeAndCompany(companyId, code);
  }
}
