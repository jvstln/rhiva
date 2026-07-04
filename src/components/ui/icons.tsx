import type * as React from "react";

export type IconProps = React.ComponentProps<"svg">;

export const TelegramIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
  >
    <title>Telegram icon</title>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);
TelegramIcon.displayName = "TelegramIcon";

export const DiscordIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
  >
    <title>{"Discord"}</title>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg>
);
DiscordIcon.displayName = "DiscordIcon";

export const XIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
  >
    <title>{"X"}</title>
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
  </svg>
);
XIcon.displayName = "XIcon";

export function SolflareIcon({ ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <title>Solflare icon</title>
      <rect width={58} height={58} fill="url(#a)" rx={10} />
      <defs>
        <pattern
          id="a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <use xlinkHref="#b" transform="translate(-.393) scale(.00595)" />
        </pattern>
        <image
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAABTVBMVEX/7kT/70cBBA0AAAD970QBBAn/70gAAAsAAAwAAAj+8Eb/7UP/7koABQoAAA8AAAX/7U4AABH/8UD/9EgABgAABgb/9lAAABX/7FH/9lf/9l7/90oBBgP/9lEEARL/8zfZ1GEAABn/9WH//FtRSjP/+Ub//E7/+lb58V+Ig1AkIxZHRCSdllfh2Gz+9zu6s2A9PSP/9XCzql4qJh8xMSHEvmJZWCiUikbWyWosLReFhknSyWHDwFne2XMfIRy3r1SnrFl6d0B9eVPy7HAYGBfo4XFxbUvt411vbDbw5VIoLRVRTyFjYjrCtUltZylbWCF0aB/QzVF4djSbmEqIgTgUDgABASGXkjeinTQYGALQzFlaWDdHTCjg1lo2MBa3rkbT0EehnFGvtFpFRC+hnUFKQwxcYUFqcDyaly08QBNCNxeTjFoXHxh+eyiwrTgh5p1QAAASDklEQVR4nO2d+1fbSLLHJZXUetAtyd2WbUl+AImxAwkJGUiGhE2WIcTxJJAlkGXDDAm5k3vnzu6d/P8/3mr5AbZlHHZ3dgZF32GSYMw56HOqqqu6qhtFyZUrV65cuXLlypUrV65cuXLlypUrV65cuXLlypUrV65cfyCp/3H93k/8LyiHdQXlsL5Uzu8By/m9n/qfVA7rCsphXUE5rCsoh3UFfTEs7jgOVbhDCf6D+PRfYZx5WBVVJ44I21HMFUp8nyIzJ4c1RZSK1vyt5ZXbdyIhGpzksKaKVFZv3L0JtgUA927fWQudHFbakzmKSlUR3f8GgDGmaXUTYP32fFQThKiKil5J0/kmH18VLGk9lEcb6+AiqL5sT/I6xfjFZfzSeZqZUYdTPdX+sgoLFz7CozsPYMEygiEsA4X+uP7w27WSaDRq6dGeC5JKMbOwKFVE9BDsIKhWrRFYVt1FXpuPHq+FQkljooRbW7WvBpaMOITHf7oHblBnbt0egaUVgwLTENiTW48XY0d3xiKU0npqwx3xtcDyOfUb0Z/h3KLSZGD8Cm5trNW4EAK/g+jUV7nfuHEbLBPmhd8cBZVI14c/ga73Phn8rUx8cvHFiS+kvvM30iWwSMOnfG3bWyheDstgRsGF4LuNdqmCsR6zfEcnvL0NhmXZz3ZXK+QrgKX6dHXnJhiaMQMWytYwn3i2vdVuCUp0rvP2Kwg0y9JgeZdPWlYal2sOS+G764AwLmWVwGL4wQzXg/rzDYz3TqlzD6quZjCNed90RoJWFmEpvqOs7iyDZrEgYEkyOksWssH45b64u3ZnGQwjCFzT1WCzOxHhsxbgCeV8d9NyA61sacys12fD6puZjQ4JrlwuNSgG7ko7+6shVfjaPbMQGO73RQCTXR7kR3yyqtm2/Nv0jAV4WcEcP+uwVL74CtOrQDNfrO3tA1bQXwyrbrpukogFmv064vpkgZg1WErrEDBCm8x6X+Jxd+8vAJYsDgOmYQxLWEyBpck3BJZl1jV4Hek+1zMNS65X/E+9XJS5XogVMYnCzy8wFpUXyppbt6bCGsjVqlXmvWilbztkDJYe3jSTutk04EBgsHd8EVe23iAvjxWLs2FVmQtvwob/NcASd6GQwHKL5mGJqjqfU0hFlNonb6Q/zoRlFV04ajUq6duDGYMVrkMvtTKLCysRIVRxiMPndI72tfeXt+C5jLlaEZPOYCIDYxZm7i4clzBX4ymoMgZLOCfQtx27WsZimJ83c3wiwvbBG+Rlu38tuIX6xDJpWEbAvOOldBfMGizKay8GsCybea8irgx3jinhgghcH2X8sg1WnbCsQsBM+FvJX52yqZwtWIRGT7xBVDINDe6H/PzBsbDDlJX4cetkG9PVwmTAKpbhc8un6S6YMVgKr3RgEMKZZgYuPA4xD1cIkcFLpVRGNU5VEYd70h/Nc+OS34N29aGGrjzVsLIEi+jiBEbWOxPuRxyrRd3R+cjbqSgtnrx5B54hdxgkKFwobdiL0/s9GYSl8toWsJHkwIVXpzdWFd+n/ggG6gjSxHxiexDiMMk3Ya85rQeWQVg6wrpoWVhFuwCvttZKzYY+tu2pKBWft4frgR2UvZOm70+PV1mD5WDmcNGyGDNsO7Dh2a2NtZLQFRVjl3wfIdwhVHfaP9ha3w0R6mmsKjNa1RmBRX3BMXh3UpsUFoD7HdqX7EE7+D5VUXxE1/4xaftYssjx4LR0uQtmCJaiY1xSw/mqmwILzce0oS532hucVHBRrDR8v71S6LVfg6JlP+vEl3tglmARrAJF+yGksyprAQts9Mfv5E4754QrYue9qxllaVmWZm924oo+e9IkI7Co01h8/D14mpkGi2mWDGSIC55ty06hKnY33arhylcNZm92RYWTr8INFV0lvnPjFpoVFsqFoDyxsWBolpkknszFSG6hfZ0um/LzgmmYDN53GpR+JbB8rHzFzk9gBEVM2sEOJk3rogLbA+NZOZmtMYrMhZU2r8zklBVYVOHhY7scYGZZgMODKXFrKJexsmu7SYZhaGVk1ZiRXmUJFuHhRn/Lz94P4w+QGrcuemWxyqrQ+zfsh7o/K7/KCCysj/250ga4ASt7gf22q9LmB8D8ybYKWnqDFeOW7br9uIbV41qr2ahgOeRwrs9YEYcd6and5NQ29Ze98BtqAAuTBmcXesuaBh9jTMyjg7deYFWZNrsLxhgmrM/vdlqrMgGr9DuFzgWlwppsxo8j+EPCEnJgZt0tJnHKgNMGx3Wt2d1H42IzZh2S7zBcORkCr+7uyPyL96ZMp8PqT9HozrWExX0e3YZykrhbBkQCbUNv+PHBS/CsGctiz7YwfiW8XmzsLAp9hmU519qyFNrYAcuwk5huQcvHoo9iIOO1k32Q23vMYgjDddMnRHBJtFw5PRKUMel4vrEW65TojkNI6gS4ozvO4EFnw9LTvqDo0174DTVYDefiQxgYiQud4U6M0mh2Pr30TFs6Y/AFHqlpngfrt3ea3Kf0nNUIs9mwBtIvauILl77wG2hoWdHKcGS0Ck9XB89FfN/hS7XPLwHMQPa/ZmRfCW3M0+DRTg3XxWmwdH1ubviAc3Pyk96fqP6fc6mw+u/pfeH82+bm/hPuOIhZla43XPSYfW84J8R1nyqEiKXuh5dyPOQLwn3BKGICYsLDnZo4n/kehzV84kt/vKtZ1r+dzpiGAf7MG0ajOoPDlorrP6XSk3RH6ISqjaXu09cYwWfSwlzDso3A9Z5shA0yC9blP94fEpYjti5QwPXwY9SgRP4MF/zHiePuh1egnQ+ZXtrGN0zYXhPEz9zIEXG2vPNtZNmh2d6NdTK27vNK48b2AJbR13RYmN3eXFutTHZ6rjssseWdPyUzrADqHzuhUEYjczKE3OfDZsGytCCAn9qNzE3+OY2Dczd0DSbHYEzzZzmqLQ+uJmctsCiKzllpdtK+v4QWIrcY/LDIswaL0zZ440+OOOyfN9ZC4nCdlhyFt28Ck6lDoNWLLmwd/PoOLE/mopbb7+5MKIDDUMXcNEuwqNr6ccJM0DSk+fy80VlEXGpj56atBTLBKGiBC3txoxkeHC2DWWCYK0yb/bZgl49PSl53WEr8aawLLWGZVhAUTLCeP92pRZ0VYIEmLcsIynAQK5UK4c3o4GgTwC2nb+QYGlvYxtp6tEV9zWFh9hha9ngAMoLAtCCQHQrr1X/9BFgh9piYME8odxqOirlFHJ4efw9memrPNAadUFeyBAujOJpW2QjGXNGQHy5mmZYHuFyacje5iq41XyMy7usyb1W4KJXOjjfBLjCr7o5bGIM/1xoVJUOwJK3Wil2sz5wW1VjBenu6yv2LOQXm+aXawWuQOw8TFuY9iLifJVjJ6aOdt6Y5G5ZmLf8pFnTkQK8u78cgSwcvwdTs8febT9bkofRswaLi9B3MhGUZLFg5PJATIuewMDegFMuA2iewJr7dgi7hWYpZyRMrovPfcsHTgur0MxQYssuuCesPH8uOtC4cGbUUqiM6rvjx2VsvAHP0iCKcEU4zBosSnUTHUDDs8sKs2CXP3m++2WiHJSpnJ3t2I3P8UnfTGj/OCQdUzxwslXM17OwDVIuX7yf0zuiULTCfb6y1HHU4O6kIv9EBC7PZUVi+kzVYsgjEtKl1emTb3kTONcpK2pZny4LIe74RhcPFjvNKcws0NtKfhTMnczELQzz6lK9gVv5hXx7S0QKsd6bxkg0K2WW1AJ4ctktO0qDwKRd+bd8LhvmDPHcoA3zWLOv8WYQIw70XWMQUjFkt/GT4G2zEJZuFyS6ycgraRVg2VPwMw9J1ncpDhvvvvJQzARMuiRk+fLOxpCh+knzNLT0wh61GhOWtRGrm3HAonajckVfy3DiEqW54AZZpaoENt6KG39tYXX0Kw5pHXlpzVBsbfsgSLCU5Q0GV8Db0kwBDHktBl2SpzWmDmQbTYDtSeq0vvwMX3RC2nGyVO5OuqPBFOQMo6TBWB9t03YC5BWtqUsHgYam3aU/C4bSSKxP4tsOdzLqhVIPceAT9S6CM4K9wdPw9Aiu41fF9iQsGBo/jXn8jvHe+oR8svEEvpJmGRdvbUEDXS7JLFz4thbWzo82kyzoNVrHwS+9yO9K6CcNXGZxiFUkyDIvo0SusEo16MuLgwoeawrkTR3LXSu7Vp8LSqrAlxmFV3ZeRPEOW2ZhFFBr9D/SnRV3Tgw9xRVXkuJuIS2fH79EfTabJjdWLqFxmmD/HRA5nte5Z/eDOAjgQWevujMh3bqBpuL2xhqAMW82GL5KHlAFJhJ3//QVMe+JwNLPKy+iHuqpHy6bWv9HH3m+lJHK/91P/k0o9nLn2o8zBe31n2Zqg/WOpya6Xzp0o7B7/HeyxhNWwCtARVB8c/UmuioKuPnlWOkOwnJ17ILvSPedCVlj3cX8Ay6G+vEssrh1g/ThKywQ4aWIWLx5D3wsN+NT0M3txDyd+Y2cdtEHMsZfnm77MUin1B4klUbhOiM6XTh+ATL6GloVsNgTXndqRK3MOwyzDgxInmYWFNrT7zeAyNlnXrX88jVYp5wonowMe1Oe89QGNq3AR1lPB1Ua7l5PWA1huZ/k2SYXvPrFd83xOxgK4eb8TiuSu7tFH9qkSn8B54EoqG8FJ8ykkg7x2AeZTR0qzAkvceYZ2JZupfViG5WJm9WpjLSyNjxyjcZHVTzAOi7aXe8fxbdhr+pmEhU/EVV66U/VYQTP621iYSMlcyrI9eHb0rRxBRoeklTlF3oxLZI9CiV5eqJlNeCx46RCYZmoBg0+xIiZAZQBWsmlH43kzdQqydznd+j/uRE20JkKH15vjyvf0fBLQcKFDGvNgu4ZdLMNhVi/uSZ6++a2b3jeULxYDD+CnjzuLF+6CJ0Qobbnl1bsvAwNcu7HzvTzRA2U4Drk65ZjYNYeVDDtsyMTJSNmzkrDK5bJZtEx4cHd3Uc6xJ7CoIK0fYZC/GvZ6GP6QBDEGx0tqxZ+6/3M9NZiiUZVwA0zD1dKm0iQszKcMM6jKzPPF1lroKATTeiL80vmQqWY+uHEEWPbgmz61VEfnKdn7NYeV3FpXqT0Fm82cc5BMbIAnj+bbzQav6Ire/LV/PMo0NPsf9yFgBisjK15Jt6oMwKJLd2H2TX4DM2OeDeu3dyOBeX3tyOrfa4CwbkI5MMsebMWNafEqA7Ba98G4ZL5hhJWWXJEImK3ebYdxcwhL7pUGVXlp8Okqxit98hbJLMAievhRtiaS/5L7ii45oCMPgFmsqpWtQB4wfLr2yKxqg6u2Cla9Dr905fAWVzJ3M1uSX82Ft+X2Z2Bh2PGssjHoSVw+5p7g8eD/vvEG78bvNzR4I0ldflj6OsOKHoLJ5GFUeXr36B3YprzvtueWM2CVXXs4EW4GRt2CT2FqhZMVWOEj15U9G7NaKL89jRcP3oAHg8Mml8OqXnyXaVTBPCjRwSmDLMISDyFIPE8L7HcdKhxeCj8/wOq5oM0M+JapmcbQaQvwY7epyCbh5AmULMDCAK93l8EtYMAqFv7eDdVk5lHE8nihJ8vpQGajM2cn5dvQhWtfdrHD9YWliM47T96PYr4MxfDUPBdR52+/QFIUz77wVpZIUD2IZ19Dc91hVeIzdLkC7Ie8MuxLoBqidHb4HgoLsy3LdgvwuutM2ZHJEiyHigOw4E3o9A8k9Zs4FP+Pw9Nf34Fnz4BleHBYU8ZG1jIJS6eqOIHjmFD1fOeYq1TVZaAWcYTLI8avIJC5BRvJ85MKGyOWt3kaKyTlmvzMwZI/vui2ppRyaG4kru29BrcsU/u6OQ5roWjCr21H+UKrygCsSsPxU3cJevt8vNnsfpanyVnv1wwMAzvKtt+dxGidV/hlh9cclu9PMQyExbkjh0JFqftpBWzLYBcti9mw35Ut6y91wQzA4kSZPJ3bo5U8muorlMpwf/wew70MU4ZMwIKqDXstlegyvn01sL5MVBfhjbOjt2DZ2oJr21gKvu7GM0vBrxSW/P2Oehyd/Yrhy9QYwOelsfP5OayBMA+T/qqLUri3Dy486K5WaPovx8wkLOVKv6Fc7ibI4EQVWT1+XnLk701Rr7IQXndYl+qSJxbia/vVyLN0yRNfPbBnHdYl/awc1oRyWL+zclhXUA4rV65cuXLlypUrV65cuXLlypUrV65cuXLlypUrV66r6f8B0OK5jweUDjcAAAAASUVORK5CYII="
          id="b"
          width={300}
          height={168}
          preserveAspectRatio="none"
        />
      </defs>
    </svg>
  );
}

export const SolanaIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 397 311"
    width="1em"
    height="1em"
    {...props}
  >
    <title>Solana icon</title>
    <defs>
      <linearGradient
        id="a"
        x1={360.879}
        x2={141.213}
        y1={351.455}
        y2={-69.293}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset={1} stopColor="#DC1FFF" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      d="M64.6 237.7c2.6-2.6 6.1-4.1 9.8-4.1h311.9c6.2 0 9.3 7.5 4.9 11.9l-61.6 61.6c-2.6 2.6-6.1 4.1-9.8 4.1H8c-6.2 0-9.3-7.5-4.9-11.9l61.5-61.6zm0-233.8C67.2 1.4 70.7 0 74.4 0h311.9c6.2 0 9.3 7.5 4.9 11.9l-61.6 61.6c-2.6 2.6-6.1 4.1-9.8 4.1H8c-6.2 0-9.3-7.5-4.9-11.9L64.6 3.9zm265.1 116.3c-2.6-2.6-6.1-4.1-9.8-4.1H8c-6.2 0-9.3 7.5-4.9 11.9l61.5 61.6c2.6 2.6 6.1 4.1 9.8 4.1h311.9c6.2 0 9.3-7.5 4.9-11.9l-61.5-61.6z"
    />
  </svg>
);
