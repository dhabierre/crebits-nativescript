import { Component, OnInit } from "@angular/core";
import * as Platform from "platform";
import FrameModule = require("ui/frame");
import * as AppVersion from "nativescript-appversion";
import { Options } from "../../shared/models/options";
import { OptionsDataService } from "../../shared/services/data/options.data.service";
import { FeedbackService } from "../../shared/services/feedback.service";

let UtilityModule = require("utils/utils");

@Component({
  selector: "about",
  //templateUrl: "pages/about/about.xml"
  templateUrl: "./about.xml"
})
export class AboutComponent implements OnInit {
  
  public options: Options;
  public version: string;

  constructor(
    private feedbackService: FeedbackService,
    private optionsDataService: OptionsDataService) {
  }
  
  ngOnInit() {
    this.optionsDataService.load(options => {
      this.options = options;
    });
    AppVersion.getVersionName().then(version => {
      this.version = version;
    });
  }
  
  public openPaypal() {
    UtilityModule.openUrl("https://www.paypal.me/ananapps");
  }

  public openFeedback() {
    this.feedbackService.compose();
  }

  public back() {
    FrameModule.topmost().goBack();
  }
}