---
taip: 1
title: TAP and TAIP Purpose and Guidelines
status: Review
type: Meta
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-01-09
updated: 2024-01-09
---
## Transaction Authorization Protocol (TAP) Rationale

Currently there is not a good abstract and chain agnostic method for multiple parties to reason about and collaborate around blockchain transactions. As an example, in a typical blockchain transaction the only party able to authorize a transaction is the holder of a blockchain account. Smart contract based applications can implement authorization functionality within their code, but they do not work universally across different kinds of blockchains.
As more and more businesses and individuals work to utilize blockchains for real world applications, it becomes increasingly important to be able to manage this. See the [TAP Whitepaper] for more.

## What is an TAIP?

TAIP stands for Transaction Authorization Improvement Proposal and is designed as a basic building block for specifying and implementing the Transaction Authorization Protocol. A TAIP is a design document providing information to the community or describing a standard to be used for transaction authorization between multiple off-chain parties across multiple chains.

The TAIP should provide a concise technical specification of the feature and a rationale for it. The TAIP author is responsible for building consensus within the community and documenting dissenting opinions.


## TAIP Rationale

Blockchain development is still under very rapid pace. Adding authorization support to new technologies requires a decentralized approach to authoring this. 

TAIPs allows authors to focus on specific aspects of authorization and interactions with new protocols, technologies, and workflows.

## TAIP Formats and Templates

TAIPs should be written in [markdown][] format.
Image files should be included in a subdirectory of the `assets` folder for that TAIP as follows: `assets/taip-N` (where **N** is to be replaced with the TAIP number). When linking to an image in the TAIP, use relative links such as `../assets/taip-1/image.png`.

## TAIP Header Preamble

Each TAIP must begin with an [RFC 822] style header preamble, preceded and followed by three hyphens (`---`). This header is also termed ["front matter" by Jekyll]. The headers must appear in the following order. Headers marked with "*" are optional and are described below. All other headers are required.

* `taip:` TAIP number (this is determined by the TAIP editor)
* `title:` TAIP title
* `author:` a list of the author's or authors' name(s) and/or username(s), or name(s) and email(s). Details are below.
* `discussions-to: *` URL pointing to the official discussion thread
* `status:` `Draft`, `Rejected`, `Review`, `Last Call`, `Withdrawn`, `Final`, `Superseded`
* `review-period-end: *` date review period ends
* `type:` `Standard`, `Informational`, `Meta`
* `created:` date created on
* `updated: *` comma separated list of dates
* `requires: *` TAIP number(s); if multiple, use `1, 2` format to create a YAML array
* `replaces: *` TAIP number(s); if multiple, use `1, 2` format to create a YAML array
* `superseded-by: *` TAIP number(s) or URL of non-TAIP standard

Headers that permit lists must separate elements with commas.

Headers requiring dates will always do so in the format of ISO 8601 (yyyy-mm-dd).

#### `author` header

The `author` header optionally lists the names, email addresses or usernames of the authors/owners of the TAIP. Those who prefer anonymity may use a username only, or a first name and a username. The format of the author header value must be:

> Random J. User &lt;address@dom.ain&gt;

or

> Random J. User (@username)

if the email address or GitHub username is included, and

> Random J. User

if the email address is not given.

#### `resolution` header

#### `discussions-to` header

While a TAIP is a draft, a `discussions-to` header will indicate the mailing list or URL where the TAIP is being discussed.

As a single exception, `discussions-to` cannot point to GitHub pull requests.

#### `type` header

The `type` header specifies the type of TAIP: Standard, Meta, or Informational.

#### `created` header

The `created` header records the date that the TAIP was assigned a number. Both headers should be in yyyy-mm-dd format, e.g. 2001-08-14.

#### `updated` header

The `updated` header records the date(s) when the TAIP was updated with "substantial" changes. This header is only valid for TAIPs of Draft and Active status.

#### `requires` header

TAIPs may have a `requires` header, indicating the TAIP(s) on which this TAIP depends. Note that if the TAIP requires multiple others, the value should be an array of integers (no `"` needed) and/or URLs (wrapped in `"`s) within square brackets (`[]`).

#### `superseded-by` and `replaces` headers

TAIPs may also have a `superseded-by` header indicating that a TAIP has been rendered obsolete by a later document; the value is the number of the TAIP that replaces the current document. The newer TAIP must have a `replaces` header containing the number of the TAIP that it rendered obsolete.

## Auxiliary Files

TAIPs may include auxiliary files such as diagrams. Such files must be named TAIP-XXXX-Y.ext, where “XXXX” is the TAIP number, “Y” is a serial number (starting at 1), and “ext” is replaced by the actual file extension (e.g. “png”).

## Transferring TAIP Ownership

It occasionally becomes necessary to transfer ownership of TAIPs to a new champion. In general, we'd like to retain the original author as a co-author of the transferred TAIP, but that's really up to the original author. A good reason to transfer ownership is because the original author no longer has the time or interest in updating it or following through with the TAIP process, or has fallen off the face of the 'net (i.e. is unreachable or isn't responding to email). A bad reason to transfer ownership is because you don't agree with the direction of the TAIP. We try to build consensus around a TAIP, but if that's not possible, you can always submit a competing TAIP.

If you are interested in assuming ownership of a TAIP, send a message asking to take over, addressed to both the original author and the TAIP editor. If the original author doesn't respond to email in a timely manner, the TAIP editor will make a unilateral decision (it's not like such decisions can't be reversed :)).

## TAIP Editors

Temporarily [Notabene](https://notabene.id) will act as editors. Notabene pledges to implement a simple informal governance structure during H1 2024 to include more parties and lessent the reliance on a single company.

## TAIP Editorial Process

For each new TAIP that comes in, an editor does the following:

- Read the TAIP to check if it is ready: sound and complete. The ideas must make technical sense, even if they don't seem likely to get to final status.
- The title should accurately describe the content.
- Check the TAIP for language (spelling, grammar, sentence structure, etc.), markup (Github flavored Markdown), code style.

If the TAIP isn't ready, the editor will send it back to the author for revision, with specific instructions.

Once the TAIP is ready for the repository, the TAIP editor will:

- Assign a TAIP number (generally the PR number or, if preferred by the author, the Issue # if there was discussion in the Issues section of this repository about this TAIP)

- Merge the corresponding pull request

- Send a message back to the TAIP author with the next step.

The editors don't pass judgment on TAIPs. We merely do the administrative & editorial part.

## History

This document was derived heavily from [CAIP-1] written by Ligi, which was derived by [Bitcoin's BIP-0001] written by Amir Taaki, which in turn was derived from [Python's PEP-0001]. In many places text was simply copied and modified. Although the PEP-0001 text was written by Barry Warsaw, Jeremy Hylton, and David Goodger, they are not responsible for its use in Transaction Authorization Improvement Proposals, and should not be bothered with technical questions specific to TAIPs. Please direct all comments to the TAIP editors. 

### References

[TAP Whitepaper]: ../Whitepaper
[CAIP-1]: https://chainagnostic.org/CAIPs/caip-1
[markdown]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
[Bitcoin's BIP-0001]: https://github.com/bitcoin/bips
[Python's PEP-0001]: https://www.python.org/dev/peps/
[RFC 822]: https://www.ietf.org/rfc/rfc822.txt
["front matter" by Jekyll]: https://jekyllrb.com/docs/front-matter/

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).