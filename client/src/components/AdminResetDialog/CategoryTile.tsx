import * as React from "react";
import reactCSS from "reactcss";
import { BlockPicker } from "react-color";
import Octicon, { X } from "@githubprimer/octicons-react";

export interface ICategoryTileProps {
  category: any;
  onColorChange: any;
  onDelete: any;
}

class CategoryTile extends React.Component<ICategoryTileProps, any> {
  public state = {
    // whether the color picker pop up is displayed
    displayColorPicker: false
  };

  private handlePickerClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  private handlePickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  private handleColorChange = (dColor: any) => {
    this.props.category.color = dColor.hex;
    this.props.onColorChange(this.props.category);
  };

  private handleDelete = () => {
    this.props.onDelete(this.props.category);
  };

  public render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "1.5em",
          height: "1.5em",
          borderRadius: "2px",
          background: `${this.props.category.color}`,
          display: "inline-block",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          cursor: "pointer"
        },
        popover: {
          position: "fixed",
          top: "50%",
          left: "50%",
          marginLeft: "-85px",
          marginTop: "-130px",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div className="category-tile-wrapper div-centre">
        <div className="category-tile">
          <span>{this.props.category.name}</span>
          <div style={{ float: "right", width: "1.5em", height: "1.5em" }}>
            <div style={styles.color} onClick={this.handlePickerClick} />
            {this.state.displayColorPicker ? (
              <div style={styles.popover}>
                <div style={styles.cover} onClick={this.handlePickerClose} />
                <BlockPicker
                  triangle="hide"
                  width="200"
                  // default color choices, can be tweaked
                  colors={[
                    "#f44336",
                    "#e91e63",
                    "#9c27b0",
                    "#673ab7",
                    "#3f51b5"
                  ]}
                  color={this.props.category.color}
                  onChange={this.handleColorChange}
                />
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-light float-right btn-top-round"
          onClick={this.handleDelete}
        >
          <Octicon className="octigrey" size="small" icon={X} />
        </button>
      </div>
    );
  }
}

export default CategoryTile;
