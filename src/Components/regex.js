const unameRegex = /^[a-zA-Z0-9._ ]{3,16}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,}$/;
const emailRegex = /^[A-Za-z][A-Za-z0-9._%+\-]{2,}@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,}$/;
const mobileRegex=/^(\+\d{1,3}[- ]?)?\d{10}$/;
const ageRegex=/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
const cityRegex=/^[A-Za-z\u00C0-\u017F' -]+(?:[A-Za-z\u00C0-\u017F' -]*)$/;
const cgpaRegex = /^(10|[1-9](\.\d{1,2})?)$/;
const monthRegex = /^(1[0-2]|[1-9])$/;
const yearRegex = /^(19[2-9][0-9]|20[0-9][0-9])$/;






const validateUname = (uname) => {return unameRegex.test(uname);}
const validatePassword = (password) => {return passwordRegex.test(password);}
const validateEmail = (email) => {return emailRegex.test(email);}
const validateIdentifier = (identifier) => {
    return unameRegex.test(identifier) || emailRegex.test(identifier);
};
const validateMobile=(mobile)=>{return mobileRegex.test(mobile);}
const validateAge=(age)=>{return ageRegex.test(age);}
const validateCity=(city)=>{return cityRegex.test(city);}
const validateCgpa = (cgpa) => {return cgpaRegex.test(cgpa);}
const validateMonth = (projectDuration) => {return monthRegex.test(projectDuration);}
const validateYear = (projectYear) => {return yearRegex.test(projectYear);}


export {validateEmail,validatePassword,validateUname,validateIdentifier,validateMobile,validateAge, validateCity,validateCgpa,validateMonth,validateYear}