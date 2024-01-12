# Contributing

1.  Review [TAIP-1](./TAIPs/taip-1.md).
2.  Fork the repository.
3.  Add your TAIP to your fork of the repository. There is a [template TAIP here](../taip-template.md).
4.  Submit a Pull Request to Transaction Authorizations's [TAIPs repository](https://github.com/TransactionAuthorizationProtocol/TAIPs).

Your first PR should be a first draft of the complete and implementable TAIP. 
An editor will manually review the first PR for a new TAIP and assign it a number before merging it.
Make sure you include a `discussions-to` header with the URL of an issue or discussion on this repository, or any other forum where you would welcome discussion.

If your TAIP requires images, the image files should be included in a subdirectory of the `src/assets` folder for that TAIP as follows: `src/assets/taip-N` (where **N** is to be replaced with the TAIP number). 

When linking to an image in the TAIP, use relative links such as `../assets/taip-1/image.png`.

It is recommended that you render your PR locally to check the makrdown syntax; to do so, run `mdbook build`.

## License 
<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://tap.rsvp">Transaction Authorization Protocol</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://notabene.id">Notabene, Inc.</a> is licensed under <a href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>

This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.

TAP was initially created by [Notabene](https://notabene.id) but is designed for anyone to build on and contribute to. Individual TAIPs are created by their individual authors and by submitting it to this repository follows the same license.

## Style Guide

Github-flavored Markdown is encouraged for all TAIP documents, with the following conventions observed:

Line breaks:
- One line per sentence (or independent clause in the case of semicolons) makes for easier parsing of diffs in PR review and is preferred but not required

Link formatting:
- All external documents cited should be defined at the end of the `## References` section of each document, one per line, in the form `[TAIP-1]: https://tap.rsvp/TAIPs/TAIP-1` - these link alias definitions are invisible in rendered markdown, but serves as footnotes to readers viewing the files in a text editor.
- All references to other TAIPs should refer to the rendered form on the tap.rsvp domain (e.g. `https://tap.rsvp/TAIPs/taip-1`) rather than to the current public git repository that it renders from (currently, `https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/src/TAIPs/taip-1.md?plain=1`, but subject to change)
- All references elsewhere in the text should be by link-alias (e.g. `[TAIP Syntax][TAIP-1]`) rather than self-contained (e.g. `[TAIP syntax](https://tap.rsvp/TAIPs/taip-1)`); note that in this example, `[TAIP-1][TAIP-1]`, `[TAIP-1][]` and `[TAIP-1]` will all link to the same URL if the alias has been defined elsewhere in the document when rendered. This makes the document easier to read in a text editor.
- Links to other sections should always take the form of markdown section heading links rather than HTML anchors or any other reference, e.g. `For further detail, see the [Security Considerations section](#security-considerations)`
- Providing lists of normative and non-normative references according to, e.g., the [IETF style guide for references](https://www.ietf.org/archive/id/draft-flanagan-7322bis-07.html#section-4.8.6) is welcomed but not required; a short list of useful documents or additional resources with captions or explanations is also welcome.

## References

[TAIP-1]: https://tap.rsvp/TAIPs/taip-1
