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

---

# Enterprise TLS/SSL Interception

## Introduction

**TL;DR**: Your certificates are subsituted by your organization's security software.

If your organization uses a Zero Trust Exchange platform, HTTP proxy, VPN, or other technology that controls your machines internet traffic, you may be subject to [TLS/SSL Inspection](https://www.zscaler.com/resources/security-terms-glossary/what-is-ssl-inspection).

One way to check is to check the certificate of a well known web service such as Google or Amazon. If their certificates are replaced (i.e. Google is not using a Google certificate) your traffic is likely being inspected.

Certificate replacement can cause TLS/SSL errors inside of docker containers because the Certificate Authority is not trusted by the image being pulled from the docker repository.

## How to fix local TLS/SSL errors

1. `cd` into the `cert` directory.
2. Run the `macos-setup.sh` script. It takes one argument which should be the name of your root certificate authority. You may need to inspect your keyring to determine this.
3. Once you have exported the certificate you should see a `.pem` file in the `cert` directory.
4. Now set the `CA_CERTIFICATE_PATH` variable in your `.env` file to the file path of that `.pem` file.
5. Use the `Dockerfile.local` and `docker-compose.local.yml` files and the `start-local-db`, `docker-build-local`, `docker-run-local`, and `docker-down-local` make recipes and you should be good to go!