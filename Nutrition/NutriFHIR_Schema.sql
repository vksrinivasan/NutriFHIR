-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/schema/RfThV0psYUu-1P0gUHnc_A
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `COMPANY` (
    `CompanyID` int  NOT NULL ,
    `Name` string  NOT NULL ,
    PRIMARY KEY (
        `CompanyID`
    )
);

CREATE TABLE `EMPLOYEE` (
    `EmployeeID` int  NOT NULL ,
    `CompanyID` int  NOT NULL ,
    `FirstName` string  NOT NULL ,
    `LastName` string  NOT NULL ,
    `Division` string  NOT NULL ,
    `OfficeID` int  NOT NULL ,
    PRIMARY KEY (
        `EmployeeID`,`CompanyID`
    )
);

CREATE TABLE `ACTIVITY` (
    `ActivityID` string  NOT NULL ,
    `Name` string  NOT NULL ,
    `Description` string  NOT NULL ,
    PRIMARY KEY (
        `ActivityID`
    )
);

CREATE TABLE `EMPLOYEE_ACTIVITY` (
    `EmployeeID` int  NOT NULL ,
    `CompanyID` int  NOT NULL ,
    `ActivityID` string  NOT NULL ,
    `ActivityDate` date  NOT NULL ,
    `ActivityValue` string  NOT NULL ,
    PRIMARY KEY (
        `EmployeeID`,`CompanyID`,`ActivityID`
    )
);

ALTER TABLE `EMPLOYEE` ADD CONSTRAINT `fk_EMPLOYEE_CompanyID` FOREIGN KEY(`CompanyID`)
REFERENCES `COMPANY` (`CompanyID`);

ALTER TABLE `EMPLOYEE_ACTIVITY` ADD CONSTRAINT `fk_EMPLOYEE_ACTIVITY_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `EMPLOYEE` (`EmployeeID`);

ALTER TABLE `EMPLOYEE_ACTIVITY` ADD CONSTRAINT `fk_EMPLOYEE_ACTIVITY_CompanyID` FOREIGN KEY(`CompanyID`)
REFERENCES `COMPANY` (`CompanyID`);

ALTER TABLE `EMPLOYEE_ACTIVITY` ADD CONSTRAINT `fk_EMPLOYEE_ACTIVITY_ActivityID` FOREIGN KEY(`ActivityID`)
REFERENCES `ACTIVITY` (`ActivityID`);

