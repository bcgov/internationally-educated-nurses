# SSL Certificate Renewal Process:

[comment]: # "@TODO update expiration date"

> Certificate expiry for IEN is at: ~~Wednesday, March 22, 2023~~

> Reminders are set in slack and via uptime robot.

#### Certificate Procurement Process:

All BC Government portals should procure certificates only from the approved issuer of BC Gov -

The BC Government cryptographic standards, section 2.3 states:

```
Standard

The following requirement governs all parties whose internet domain name is managed by Shared Services BC: Where an X.509 certificate is required for system authentication it MUST be obtained through Shared Services BC.
```

Cryptographic Standards - [HERE](https://www2.gov.bc.ca/assets/gov/government/services-for-government-and-broader-public-sector/information-technology-services/standards-files/cryptographic_standards.pdf)
4

####  Run the following commands to create the Certificate Signing Request (CSR) and a new Key file:

``` 
openssl req -new -out ien.csr -newkey rsa:2048 -nodes -sha256 -keyout ien.key -config req.conf
```

#### Run the following command to verify the Certificate Signing Request:

```
openssl req -text -noout -verify -in ien.csr
```

#### Send the CSR to respective government point of contact.

Current Contact information will be provided by the Project Manager.

#### Certificate issuance

iStore Request for Certificate is placed by the BC Gov IT team, and the signed Certificate, CA Chain and Root Certificate is issued.

These are then configured in AWS by uploading them directly in ACM. 
