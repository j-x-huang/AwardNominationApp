abstract class AwardsContent {
  protected url: string;
  protected awardTabs: string[];

  public getReturnURL() {
    return this.url;
  }

  public getAwardTabs(callback: (awardTabs: any) => void) {
    this.updateAwardTabs((tabNames) => {
      callback(tabNames)
    });
  }

  public updateAwardTabs(callback: (tabNames: any) => void) {
    // TODO
  }

  // public getTabNomination(tab: string, retrieveUserDetails: any) {}
}

export default AwardsContent;
