import * as React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import * as firebase from "firebase";
import NominationJustification from "./NominationJustification";
import NominationComplete from "./NominationComplete";
import SelectCategory from "./SelectCategory";
import { getUser } from "../auth";

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

    const stepperTheme = createMuiTheme({
      overrides: {
        MuiStepper: {
          root: {
            "background-color": "#f9f9f9"
          }
        },
        MuiStepLabel: {
          label: {
            "margin-top": "0.55em !important"
          }
        }
      },
      typography: {
        fontFamily: "NeutroMYOB-Reg"
      },
      palette: {
        primary: { main: "#8241aa" }
      }
    });

    return (
      <div id="nominationPage">
        <MuiThemeProvider theme={stepperTheme}>
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
        </MuiThemeProvider>

        {completed ? (
          <NominationComplete
            category={this.state.category}
            nominee={this.state.nominee}
          />
        ) : (
            <div>
              {(() => {
                switch (this.state.activeStep) {
                  case 0:
                    return <SelectCategory />;
                  // break;

                  case 1:
                    return (
                      <NominationJustification
                        category={this.state.category}
                        nominee={this.state.nominee}
                        justification={this.state.justification}
                      />
                    );
                  // break;

                  default:
                    return <SelectCategory />;
                  // break;
                }
              })()}

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
            </div>
          )}
      </div>
    );
  }

  private makeNomination = () => {
    const defaultDatabase = firebase.database();

    // Get a key for a new Post.
    const newPostKey = defaultDatabase
      .ref()
      .child("nominations")
      .push().key;

    const user = getUser();
    const userid = user.profile.oid;
    // const nomineeid = ;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    const nominationDetails = {
      category: this.state.category,
      justification: this.state.justification,
      nominator: "u", // TODO oid
      nominee: this.state.nominee,
      score: 1
    };

    updates["/nominations/" + newPostKey] = nominationDetails;
    updates["/nominators/" + userid + "/" + newPostKey] = {
      nomination_id: newPostKey,
      nominee: nominationDetails.nominee
    };
    // updates['/nominees/' + nomineeid + "/" + newPostKey] = {nomination_id: newPostKey, nominator: user.profile.name};

    return defaultDatabase.ref().update(updates);
  };

  private handleNext = () => {
    const { activeStep } = this.state;
    if (activeStep === getSteps().length - 1) {
      this.makeNomination();
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
