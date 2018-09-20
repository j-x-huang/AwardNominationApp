abstract class AwardsContent {
  protected url: string;
  protected awardTabs: string[];

  public getReturnURL() {
    return this.url;
  }

  public getAwardTabs() {
    return this.awardTabs;
  }

  // public getTabNomination(tab: string, retrieveUserDetails: any) {}
}

export default AwardsContent;
