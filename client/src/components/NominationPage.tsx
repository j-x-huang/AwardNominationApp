import * as React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import NominationJustification from "./NominationJustification";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import NominationComplete from "./NominationComplete";

function getSteps(): string[] {
  return ["Category", "Nominee", "Justification"];
}

class NominationPage extends React.Component<any, any> {
  public state = {
    category: "Being Purple",
    nominee: "Boruto's Dad",
    justification: "He achieved his dream of becoming Hokage.",
    activeStep: 0,
    completed: false
  };

  public render() {
    const steps = getSteps();
    const { activeStep, completed } = this.state;

    const theme = createMuiTheme({
      typography: {
        fontFamily: "NeutroMYOB-Reg"
      },
      palette: {
        primary: { main: "#8241aa" }
      }
    });

    return (
      <div id="nominationPage">

        {completed ?
          <NominationComplete
            category={this.state.category}
            nominee={this.state.nominee}
          />
          
          :

          <MuiThemeProvider theme={theme}>
            <Stepper
              className="stepper"
              activeStep={activeStep}
              alternativeLabel={true}
            >
              {steps.map(label => {
                return (
                  <Step className="step" key={label}>
                    <StepLabel className="stepLabel">{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <NominationJustification
              category={this.state.category}
              nominee={this.state.nominee}
              justification={this.state.justification}
            />

            <div className="buttonBlock">
              <button
                type="button"
                className="btn btn-primary buttonLeft"
                onClick={this.handleBack}
                style={
                  activeStep === 0
                    ? { visibility: "hidden" }
                    : { visibility: "visible" }
                }
              >
                Back
          </button>

              <button
                type="button"
                className="btn btn-primary buttonRight"
                onClick={this.handleNext}
              >
                {activeStep === steps.length - 1 ? "Nominate" : "Next"}
              </button>
            </div>

          </MuiThemeProvider>
        }
      </div>
    );
  }

  private handleNext = () => {
    const { activeStep } = this.state;
    if (activeStep === getSteps().length - 1) {
      this.setState({
        completed: true
      });
    } else {
      this.setState({
        activeStep: activeStep + 1
      });
    }
  };

  private handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  };
}

export default NominationPage;
