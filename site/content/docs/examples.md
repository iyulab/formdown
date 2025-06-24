# Examples

## Basic Contact Form

```formdown
# Contact Us

@name(Full Name): [text required placeholder="Enter your full name"]
@email(Email Address): [email required placeholder="your@email.com"]
@subject(Subject): [select required]
  - General Inquiry
  - Support Request
  - Feature Request
  - Bug Report

@message(Message): [textarea required rows=5 placeholder="Tell us how we can help..."]

@submit_btn: [submit label="Send Message"]
```

## User Registration

```formdown
# Create Account

## Personal Information
@firstName(First Name): [text required]
@lastName(Last Name): [text required]
@email(Email Address): [email required placeholder="Enter your email"]
@phone(Phone Number): [tel placeholder="(555) 123-4567"]

## Security
@password(Password): [password required minlength=8]
@confirmPassword(Confirm Password): [password required]
@terms: [checkbox required] I agree to the Terms of Service

@submit_btn: [submit label="Create Account"]
```

## Event Registration

```formdown
# Workshop Registration

## Event Details
You're registering for the **Advanced Web Development Workshop** on March 15, 2024.

## Attendee Information
@name(Full Name): [text required]
@email(Email Address): [email required]
@company(Company/Organization): [text]
@title(Job Title): [text]

## Preferences
@dietaryRestrictions(Dietary Restrictions or Allergies): [textarea rows=3]
@experience(Experience Level): [radio required]
  - Beginner
  - Intermediate  
  - Advanced

@newsletter: [checkbox] Subscribe to our newsletter for future events

## Payment
@eventFee: [hidden value="$299"]
@paymentMethod(Payment Method): [radio required]
  - Credit Card
  - PayPal
  - Bank Transfer

@submit_btn: [submit label="Register Now"]
```

## Survey Form

```formdown
# Customer Satisfaction Survey

## Overall Experience
@satisfaction(How satisfied are you with our service?): [radio required]
  - Very Satisfied
  - Satisfied
  - Neutral
  - Dissatisfied
  - Very Dissatisfied

## Specific Feedback
@quality(Product Quality): [range required min=1 max=10 value=5] (1-10)
@support(Customer Support): [range required min=1 max=10 value=5] (1-10)
@value(Value for Money): [range required min=1 max=10 value=5] (1-10)

## Additional Comments
@improvements(What could we improve?): [textarea rows=4]
@recommend(Would you recommend us to others?): [radio required]
  - Definitely
  - Probably
  - Maybe
  - Probably Not
  - Definitely Not

@contact: [checkbox] Contact me about this feedback

@submit_btn: [submit label="Submit Survey"]
```

@submit_btn: [submit label="Submit Application"]
```

```formdown
# Checkout

## Shipping Information
@firstName(First Name): [text required]
@lastName(Last Name): [text required]
@address(Street Address): [text required]
@city(City): [text required]
@state(State): [text required]
@zip(ZIP Code): [text required]
@country(Country): [select required]
  - United States
  - Canada
  - United Kingdom
  - Australia

## Delivery Options
@shipping(Shipping Method): [radio required]
  - Standard (5-7 days) - Free
  - Express (2-3 days) - $9.99
  - Overnight - $19.99

## Payment Information
@cardNumber(Card Number): [text required placeholder="1234 5678 9012 3456"]
@expiry(Expiry Date): [text required placeholder="MM/YY"]
@cvv(CVV): [text required placeholder="123"]

@billing: [checkbox] Billing address same as shipping

@submit_btn: [submit label="Complete Order"]
```

## Job Application

```formdown
# Job Application - Senior Developer

## Personal Information
@fullName(Full Name): [text required]
@email(Email Address): [email required]
@phone(Phone Number): [tel required]
@linkedin(LinkedIn Profile): [url placeholder="https://linkedin.com/in/yourprofile"]

## Experience
@currentPosition(Current Position): [text]
@currentCompany(Current Company): [text]
@experience(Years of Experience): [select required]
  - Less than 1 year
  - 1-2 years
  - 3-5 years
  - 6-10 years
  - More than 10 years

## Skills
@skills(Technical Skills): [textarea required rows=4 placeholder="List your relevant technical skills..."]
@portfolio(Portfolio Website): [url placeholder="https://yourportfolio.com"]

## Additional Information
@coverLetter(Cover Letter): [textarea rows=6 placeholder="Tell us why you're interested in this position..."]
@startDate(Available Start Date): [date]
@salary(Salary Expectation): [number placeholder="50000"]

@resume(Resume): [file required accept=".pdf,.doc,.docx"]

@submit_btn: [submit label="Submit Application"]
```
