import xrplLogo from '../assets/xrpl.svg';

export default function addXrplLogo() {
    document.getElementById('heading_logo').innerHTML = `
<a
    href="https://xrpl.org/"
    target="_blank"
    class="logo_link"
>
    <img id="xrpl_logo" class="logo vanilla" alt="JavaScript logo" src="${xrplLogo}" />
</a>
`;
}
