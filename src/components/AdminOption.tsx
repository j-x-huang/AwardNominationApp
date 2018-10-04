import * as React from "react";

export interface IAdminOptionProps {
  title: string;
  desc: string;
  buttonDesc: string;
  onBtnClick: any;
  disabled: boolean;
  dangerous: boolean;
}

function AdminOption({
  title,
  desc,
  buttonDesc,
  onBtnClick,
  disabled,
  dangerous
}: IAdminOptionProps) {
  return (
    <div
      className={disabled ? "adminOption adminOptionDisabled" : "adminOption"}
    >
      <div className="float-left">
        <span className="adminOptionTitle">{title}</span>
        <span className="adminOptionDesc">{desc}</span>
      </div>
      <button
        type="button"
        className={getButtonClass(dangerous)}
        disabled={disabled}
        onClick={onBtnClick}
      >
        {buttonDesc}
      </button>
    </div>
  );
}

export default AdminOption;

function getButtonClass(dangerous: boolean) {
  const defaultButtonClasses = "btn float-right adminButton";
  if (dangerous) {
    return defaultButtonClasses + " btn-outline-danger";
  } else {
    return defaultButtonClasses + " btn-success";
  }
}
