from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FilterType = Literal["none", "executor", "spouse", "has_will", "executor_or_no_will"]


class IntakeRequest(BaseModel):
    state: str
    relationship: str
    hasWill: str
    isExecutor: str


class Task(BaseModel):
    id: str
    bucket: str
    title: str
    why: str
    nextStep: str
    defaultEnabled: bool


TASK_CATALOG: list[dict] = [
    # ─── TODAY / NEXT 24–48 HOURS ────────────────────────────────────────────
    {
        "id": "arrange-funeral",
        "bucket": "immediate",
        "title": "Contact a funeral home",
        "why": "State law typically requires the body to be claimed and disposition arranged within a short window after death.",
        "nextStep": "If you don't have a funeral home in mind, the hospital or hospice can provide referrals. Ask for an itemized price list upfront — costs vary widely.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "secure-property",
        "bucket": "immediate",
        "title": "Secure the home and property",
        "why": "An unoccupied home can become a target for theft, especially once an obituary is published.",
        "nextStep": "Make sure the home is locked. If it will be unoccupied, consider asking a neighbor to keep watch or arranging for someone to check in regularly.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "care-for-dependents",
        "bucket": "immediate",
        "title": "Arrange care for dependents and pets",
        "why": "If the deceased had children, elderly dependents, or pets in their care, they need immediate attention.",
        "nextStep": "Identify who can step in temporarily. For minor children, check the will for named guardians. For pets, contact family or a trusted friend.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "secure-digital-access",
        "bucket": "immediate",
        "title": "Secure access to their digital accounts",
        "why": "You'll need access to their accounts to manage, transfer, and eventually close them. Without their phone or passwords, you may be locked out of critical accounts.",
        "nextStep": "Locate their phone and update the PIN/passcode. Find any authenticator app (Google Authenticator, Authy, etc.) on their phone. Secure their email address and password manager (LastPass, 1Password, Apple Keychain, etc.). This access is essential before accounts time out or get locked.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "notify-family",
        "bucket": "immediate",
        "title": "Notify immediate family and close friends",
        "why": "People close to them will want to know, and some may need to make travel arrangements for services.",
        "nextStep": "Call family members directly. Consider asking a trusted person to help spread the word so you don't have to repeat the conversation many times.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "notify-employer",
        "bucket": "immediate",
        "title": "Notify their employer",
        "why": "Timely notification stops payroll, and triggers the process for life insurance, pension, and any retirement benefits through the employer.",
        "nextStep": "Call HR directly. Ask about the final paycheck, accrued vacation payout, employer-provided life insurance, and any pension or 401(k) benefits.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "order-death-certificates",
        "bucket": "immediate",
        "title": "Order certified copies of the death certificate",
        "why": "You'll need multiple certified copies for nearly everything — banks, insurers, government agencies, and transfers of title won't act without one.",
        "nextStep": "Ask the funeral home to order on your behalf — they file the death certificate and can request copies at the same time. Order at least 10. Each copy typically costs $10–$25.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "locate-will",
        "bucket": "immediate",
        "title": "Locate the will",
        "why": "The will names the executor and determines how assets are distributed. Finding it early avoids delays with probate court.",
        "nextStep": "Check home files, a safe deposit box, or contact their attorney. Some states have will registries you can search. If you can't find one, the estate may be treated as if there's no will.",
        "defaultEnabled": True,
        "filter": "has_will",
    },
    {
        "id": "find-surrogate-court",
        "bucket": "immediate",
        "title": "Find the probate/surrogate court for their county",
        "why": "Probate is filed in the county where the deceased lived. Knowing the location early lets you schedule an appointment and understand local requirements.",
        "nextStep": "Look up the surrogate's court or probate court for their home county. Many courts allow you to schedule appointments online. Bring the original will (if there is one) and a certified death certificate.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    # ─── THIS WEEK ───────────────────────────────────────────────────────────
    {
        "id": "apply-for-letters",
        "bucket": "this-week",
        "title": "Apply for letters of executorship or administration",
        "why": "Letters of executorship (if there's a will) or letters of administration (if there isn't) are issued by probate court and legally authorize you to act on behalf of the estate. Banks and institutions will require them.",
        "nextStep": "File at the surrogate's or probate court in the county where the deceased lived. Bring the original will (if there is one), a certified death certificate, and your ID. If there is no will, apply for letters of administration instead. There is typically a filing fee.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "transfer-utilities",
        "bucket": "this-week",
        "title": "Transfer or manage utility accounts and bills",
        "why": "Bills for an occupied or maintained property need to continue being paid to avoid service interruption or late fees.",
        "nextStep": "Contact each utility provider (electricity, gas, water, internet, cable) to either transfer the account into your name or the estate's name, or to cancel service if the property will be vacated. Set up autopay where possible.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "transfer-rent-mortgage",
        "bucket": "this-week",
        "title": "Address rent or mortgage payments",
        "why": "Missed mortgage or rent payments can trigger fees, foreclosure notices, or eviction proceedings against the estate.",
        "nextStep": "Contact the landlord or mortgage servicer to notify them of the death and discuss next steps. For a mortgage, ask about a temporary forbearance if needed. For a lease, ask about early termination options.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "transfer-property-insurance",
        "bucket": "this-week",
        "title": "Transfer or update property and auto insurance",
        "why": "An unoccupied property or a vehicle without active insurance creates liability. Some policies may automatically lapse after a death.",
        "nextStep": "Call the insurance provider(s) for home/renter's insurance, auto insurance, and any other property coverage. Notify them of the death and ask what's needed to continue or transfer coverage.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "forward-mail",
        "bucket": "this-week",
        "title": "Forward their mail",
        "why": "Important financial statements, bills, and legal notices may still arrive by mail. Forwarding ensures nothing is missed.",
        "nextStep": "Submit a mail forwarding request at usps.com or your local post office. You'll need to show authority to act on their behalf (a death certificate or court-issued letters).",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "dependent-coverage",
        "bucket": "this-week",
        "title": "Arrange continued coverage for dependents",
        "why": "If the deceased provided health insurance or financial support to a spouse, children, or other dependents, that coverage may lapse and needs to be replaced quickly.",
        "nextStep": "Contact the health insurance provider to understand options for continuing coverage (COBRA, new plan, etc.). Contact any financial aid offices if the deceased supported a student.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "vehicle-titles",
        "bucket": "this-week",
        "title": "Update vehicle registration and insurance",
        "why": "Vehicles owned by the deceased need to be transferred or retitled. Driving an uninsured or improperly titled vehicle creates legal exposure.",
        "nextStep": "Visit your state's DMV with the death certificate, the vehicle title, and any court documents establishing your authority. Update auto insurance at the same time.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "find-probate-attorney",
        "bucket": "this-week",
        "title": "Search for a probate or estate attorney",
        "why": "Probate law varies significantly by state. Starting your search early means you can have counsel in place before key filings and deadlines arrive.",
        "nextStep": "Search for attorneys who specialize in probate or estate law in the deceased's state. Ask for referrals from family or friends, or use your state bar's attorney directory. Many offer a free initial consultation, and fees are typically paid from the estate.",
        "defaultEnabled": True,
        "filter": "executor_or_no_will",
    },
    # ─── THIS MONTH ──────────────────────────────────────────────────────────
    {
        "id": "open-estate-account",
        "bucket": "this-month",
        "title": "Open an estate bank account",
        "why": "All estate income and expenses should flow through a dedicated account to maintain clear records for probate and tax purposes.",
        "nextStep": "Bring your letters of executorship, the death certificate, and an EIN (applied for free at IRS.gov) to a bank. All estate transactions should go through this account.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "inventory-assets",
        "bucket": "this-month",
        "title": "Create an inventory of all assets and debts",
        "why": "The probate court requires a complete accounting of the estate. It also ensures no assets are overlooked or lost.",
        "nextStep": "List all property, accounts, investments, vehicles, and personal belongings. Check your state's unclaimed property database — you may find forgotten accounts.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "claim-life-insurance",
        "bucket": "this-month",
        "title": "File life insurance claims",
        "why": "Life insurance proceeds are paid directly to named beneficiaries and don't go through probate — they're typically the fastest source of funds available to the family.",
        "nextStep": "Locate all policies, including any through their employer. Contact each insurer with the policy number and a certified death certificate. Claims are usually paid within 30–60 days.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "claim-funeral-insurance",
        "bucket": "this-month",
        "title": "Apply for funeral insurance or assistance",
        "why": "If the deceased had a prepaid funeral plan or funeral insurance, you may be entitled to reimbursement for costs already incurred.",
        "nextStep": "Check with the funeral home and the deceased's insurance policies. Some employers and unions also offer funeral assistance benefits.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "notify-social-security",
        "bucket": "this-month",
        "title": "Notify Social Security and apply for applicable benefits",
        "why": "Any Social Security payment received after the month of death must be returned. Survivors — especially spouses — may be entitled to a lump-sum death benefit or ongoing survivor benefits.",
        "nextStep": "Call SSA at 1-800-772-1213. The funeral home often reports the death automatically, but confirm it was received. A surviving spouse should ask specifically about survivor benefit eligibility.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "claim-va-benefits",
        "bucket": "this-month",
        "title": "Apply for VA benefits",
        "why": "Veterans may be entitled to burial benefits, survivor pensions, and dependency and indemnity compensation (DIC) for surviving spouses and children.",
        "nextStep": "Contact the VA at 1-800-827-1000 or visit VA.gov. You'll need their discharge papers (DD-214), death certificate, and marriage/birth certificates for dependents.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "claim-employer-benefits",
        "bucket": "this-month",
        "title": "Claim employer death and pension benefits",
        "why": "Many employers offer death benefits, and pension or retirement accounts may have designated beneficiaries or survivor options.",
        "nextStep": "Contact the HR department of each employer (current and former if applicable). Ask about death benefits, pension survivor options, 401(k) beneficiary distributions, and union benefits if they were a member.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "transfer-bank-accounts",
        "bucket": "this-month",
        "title": "Transfer bank accounts to the estate",
        "why": "Bank accounts held solely by the deceased need to be transferred to the estate account or to named beneficiaries before funds can be accessed or distributed.",
        "nextStep": "Visit each bank with a certified death certificate and your letters of executorship or administration. Ask about accounts, safe deposit boxes, and any accounts with named TOD (transfer on death) beneficiaries.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "transfer-investment-accounts",
        "bucket": "this-month",
        "title": "Transfer investment and brokerage accounts",
        "why": "Investment accounts need to be retitled or transferred to the estate before they can be managed or distributed to beneficiaries.",
        "nextStep": "Contact each brokerage or investment firm with a death certificate and letters of executorship. Ask about accounts with named beneficiaries, which typically transfer outside of probate.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "transfer-safe-deposit-box",
        "bucket": "this-month",
        "title": "Access and inventory safe deposit boxes",
        "why": "Safe deposit boxes often contain important documents, jewelry, or other valuables that need to be secured and inventoried for the estate.",
        "nextStep": "Visit the bank with a death certificate and your letters of executorship. You may need a court order in some states. Bring a witness and document everything you remove.",
        "defaultEnabled": False,
        "filter": "none",
    },
    {
        "id": "notify-creditors",
        "bucket": "this-month",
        "title": "Notify creditors of the death",
        "why": "As executor or administrator, you're required to notify known creditors so they can file claims against the estate. Failing to do so can create personal liability.",
        "nextStep": "Send written notice to all known creditors. Many states also require publishing a notice in a local newspaper for a set period to notify unknown creditors.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "collect-debts-owed",
        "bucket": "this-month",
        "title": "Follow up on money owed to the deceased",
        "why": "Any money owed to the deceased is an asset of the estate and should be collected and included in the estate accounting.",
        "nextStep": "Review their records for any outstanding loans, IOUs, or business receivables. These should be collected and deposited into the estate account.",
        "defaultEnabled": False,
        "filter": "executor",
    },
    {
        "id": "consult-probate-attorney",
        "bucket": "this-month",
        "title": "Consult a probate or estate attorney",
        "why": "Probate law varies significantly by state, and mistakes made as executor can result in personal liability. An attorney can help you navigate the process correctly.",
        "nextStep": "Look for attorneys who specialize in estate or probate law in the deceased's state. Many offer a free initial consultation. Attorney fees are typically paid from the estate.",
        "defaultEnabled": True,
        "filter": "executor_or_no_will",
    },
    {
        "id": "survivor-benefits",
        "bucket": "this-month",
        "title": "Apply for Social Security survivor benefits",
        "why": "As a surviving spouse, you may be entitled to ongoing monthly survivor benefits, which can be a substantial source of income.",
        "nextStep": "Apply at your local SSA office or call 1-800-772-1213. Benefits don't start automatically — you must apply. Bring your marriage certificate, the death certificate, and your own Social Security number.",
        "defaultEnabled": True,
        "filter": "spouse",
    },
    # ─── WITHIN 6 MONTHS ─────────────────────────────────────────────────────
    {
        "id": "file-final-tax-return",
        "bucket": "six-months",
        "title": "File their final income tax return",
        "why": "A final federal (and state) income tax return is due for the year of death, covering January 1 through the date of death. As executor, you're responsible for filing it.",
        "nextStep": "The return is due April 15 of the following year. Consider hiring a CPA familiar with final returns — they're more complex than a standard filing. File jointly with the surviving spouse if applicable.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "research-inheritance-tax",
        "bucket": "six-months",
        "title": "Research inheritance tax in your state",
        "why": "Some states impose an inheritance tax on beneficiaries. The rate and exemptions vary by state and by your relationship to the deceased.",
        "nextStep": "Look up inheritance tax laws for both your state and the state where the deceased lived. A CPA or estate attorney can advise on what you may owe and any filing deadlines.",
        "defaultEnabled": True,
        "filter": "none",
    },
    {
        "id": "file-estate-tax-return",
        "bucket": "six-months",
        "title": "File an estate tax return if required",
        "why": "Federal estate tax applies to estates over $13.6M (2024 threshold). Many states have lower thresholds. Filing is the executor's responsibility and missing the deadline triggers penalties.",
        "nextStep": "Consult a CPA or estate attorney to determine if a federal Form 706 or state estate tax return is required. The federal deadline is 9 months after the date of death.",
        "defaultEnabled": False,
        "filter": "executor",
    },
    {
        "id": "distribute-assets",
        "bucket": "six-months",
        "title": "Distribute assets to beneficiaries",
        "why": "Once debts, expenses, and taxes are settled, the remaining estate assets can be distributed according to the will — or state intestacy law if there is no will.",
        "nextStep": "Keep detailed records of every distribution. Get signed receipts from each beneficiary. Do not distribute assets until all debts and taxes are resolved.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "close-estate",
        "bucket": "six-months",
        "title": "Close the estate",
        "why": "Formally closing the estate releases you from your executor duties and protects you from future claims against the estate.",
        "nextStep": "File a final accounting with the probate court and petition for discharge. Your attorney can guide this process. Closing typically happens 6–12 months after the death.",
        "defaultEnabled": True,
        "filter": "executor",
    },
    {
        "id": "update-own-estate-plan",
        "bucket": "six-months",
        "title": "Update your own estate planning documents",
        "why": "Going through this process often reveals gaps in your own planning. Now is a natural time to review your will, beneficiary designations, and powers of attorney.",
        "nextStep": "Review your will, healthcare proxy, durable power of attorney, and beneficiary designations on all accounts and insurance policies. Consider meeting with an estate attorney.",
        "defaultEnabled": True,
        "filter": "none",
    },
]


def task_matches(task_filter: str, intake: IntakeRequest) -> bool:
    is_executor = intake.isExecutor in ("yes", "unsure")
    if task_filter == "none":
        return True
    if task_filter == "executor":
        return is_executor
    if task_filter == "spouse":
        return intake.relationship == "spouse"
    if task_filter == "has_will":
        return intake.hasWill != "no"
    if task_filter == "executor_or_no_will":
        return is_executor or intake.hasWill == "no"
    return True


@app.post("/api/tasks/generate")
async def generate_tasks(intake: IntakeRequest) -> list[Task]:
    return [
        Task(**{k: v for k, v in t.items() if k != "filter"})
        for t in TASK_CATALOG
        if task_matches(t["filter"], intake)
    ]


@app.get("/api/hello")
def read_hello():
    return {"message": "WEB Da Bois!"}
