const IO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        setAnimation(entry.target, entry.isIntersecting);

        if (entry.target.hasAttribute("data-animation-hover-retrigger"))
            setRetriggerHoverAnimation(entry);

        if (entry.target.hasAttribute("data-animation-retrigger"))
            setRetriggerAnimation(entry);
    });
});

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const elements = mediaQuery?.matches
    ? []
    : document.querySelectorAll("[data-animation], [data-animation-hover-retrigger], [data-animation-retrigger]");

elements.forEach((animation) => {
    IO.observe(animation);
});

function setAnimation(target, state) {
    target.style.setProperty("--animps", state === true ? "running" : "paused");
}

function setRetriggerHoverAnimation(entry) {
    entry.target.addEventListener("mouseenter", () => {
        setRetriggerAnimation(entry, true);
    })
}

function setRetriggerAnimation(entry, force = false) {
    entry.target.classList.remove("animate");

    if (entry.isIntersecting || force) {
        setTimeout(() => {
            entry.target.classList.add("animate");
        }, 1)
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const typewriters = document.querySelectorAll(".typewriter");

    typewriters.forEach((typewriter) => {
        typewriter.style.setProperty("--step-count", typewriter.innerText.length);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const flowcharts = document.querySelectorAll(".illustration--flowline");

    flowcharts.forEach((flowchart) => {
        const pathLength = flowchart.getTotalLength() + 1;

        flowchart.style.setProperty("--flow-line-length", pathLength);
    });
});



async function checkLogin() {
    try {
        const whoami_kratos = await fetch(
            "https://ory.kraudcloud.com/sessions/whoami",
            {
                credentials: "include",
            }
        );

        if (whoami_kratos.status != 200) {
            return;
        }

        const whoami = await whoami_kratos.json();
        return { id: whoami.identity.id, email: whoami.identity.traits.email };
    } catch { }
}

async function prepareLogin() {
    const response = await fetch(
        "https://ory.kraudcloud.com/self-service/login/browser",
        {
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
            method: "GET",
        }
    );

    const data = await response.json();

    const gh_form = {
        url: data.ui.action,
        method: data.ui.method,
        csrf_token: data.ui.nodes.find((n) => n.attributes.name === "csrf_token")
            .attributes.value,
        identifier: "",
        password: "",
        provider: "github",
    };

    const template = `
    <form style="display:none" id="form-login" action="${gh_form.url}" method="${gh_form.method}">
      <input type="hidden" name="csrf_token" value="${gh_form.csrf_token}" />
      <button id="form-login-github" type="submit" name="provider" value="${gh_form.provider}" />
      <input type="hidden" name="identifier" value="${gh_form.identifier}" />
      <input type="hidden" name="password" value="${gh_form.password}" />
    </form>
    `;

    document.body.insertAdjacentHTML("beforeend", template);
}

const buttons = document.querySelectorAll(".button_github");
buttons.forEach((button) => {
    button.addEventListener("click", async () => {
        await prepareLogin();
        document.getElementById("form-login-github").click();
    });
});

function handlePosition() {
    const body = document.querySelector("body");
    const queueBlocks = body.querySelectorAll(".queue-block");
    const signupBlocks = body.querySelectorAll(".signup-block");

    signupBlocks.forEach((block) => block.style.setProperty("display", "none"));
    queueBlocks.forEach((block) => block.style.setProperty("display", "block"));
    body.classList.add("disco");
}

const messy = async () => {
    const login = await checkLogin();
    if (login) {
        handlePosition();
    }
};

messy();



class RangeInput {
    constructor() {
        this.getElements();
        this.setEvents();
        this.setRanges();
    }

    getElements() {
        this.elements = document.querySelectorAll('.js-range');
        this.ranges = [];

        this.elements.forEach((context) => {
            this.ranges.push({
                context: context,
                input: context.querySelector('.js-range__input')
            });
        });
    };

    setEvents() {
        this.ranges.forEach(data => {
            const context = data.context;
            const input = data.input;
            const buttonIncrease = context.querySelector('.js-range__button--increase');
            const buttonDecrease = context.querySelector('.js-range__button--decrease');
            const digitsAmount = document.getElementById('js-range__amount');
            const digitsPrice = document.getElementById('js-range__price');

            input.addEventListener('input', () => {
                this.updateRangeInput(context, input);
            });

            buttonIncrease.addEventListener('click', () => {
                this.increase(context, input);
            });

            buttonDecrease.addEventListener('click', () => {
                this.decrease(context, input);
            });
        });
    };


    setRanges() {
        this.ranges.forEach(data => {
            this.updateRangeInput(data.context, data.input);
        });
    };

    increase(context, input) {
        const rangeStep = input.getAttribute('step') || 1;

        input.value = parseInt(input.value) + parseInt(rangeStep);

        this.updateRangeInput(context, input);
    };

    decrease(context, input) {
        const rangeStep = input.getAttribute('step') || 1;

        input.value = parseInt(input.value) - parseInt(rangeStep);

        this.updateRangeInput(context, input);
    };

    updateRangeInput(context, input) {
        const digitsAmount = document.getElementById('js-range__amount');
        const digitsPrice = document.getElementById('js-range__price');
        const gigabyte = document.getElementById('js-range__gb');
        const tbyte = document.getElementById('js-range__tb');
        const azure = document.getElementById('azure_value');
        const aws = document.getElementById('aws_value');
        const rangeEuro = document.querySelector('.range__img-euro');
        const numbersStyle = document.querySelector('[data="numbers"]');
        const btnIncrease = document.querySelector('.js-range__button--increase');
        const btnDecrease = document.querySelector('.js-range__button--decrease');

        const image2 = document.getElementById('plan_img2');
        const image3 = document.getElementById('plan_img3');
        const image4 = document.getElementById('plan_img4');
        const image5 = document.getElementById('plan_img5');

        gigabyte.style.display = 'inline-block';
        tbyte.style.display = 'none';
        btnDecrease.style.borderRadius = '4px';
        btnIncrease.style.borderRadius = '4px';

        image2.style.display = 'none';
        image3.style.display = 'none';
        image4.style.display = 'none';
        image5.style.display = 'none';

        // Getting previous value of range thumb
        const previousValue = input.dataset.value;
        input.dataset.value = input.value;

        const isIncrease = parseFloat(input.value) > parseFloat(previousValue);

        // Disable buttons
        if (input.value == '1') btnDecrease.setAttribute('disabled', true);
        else btnDecrease.removeAttribute('disabled');

        if (input.value == '9') btnIncrease.setAttribute('disabled', true);
        else btnIncrease.removeAttribute('disabled');

        input.classList.add('active');
        setTimeout(function () {
            input.classList.remove('active');
        }, 1500);

        switch (input.value) {
            case "1":
                azure.innerHTML = "62";
                aws.innerHTML = "68";
                rangeEuro.style.left = '48px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 31px !important; } }";
                input.style.borderRadius = '50px 20px 20px 50px';

                // Prevent animation when page is loaded
                if (input.value == previousValue) {
                    input.classList.remove('active');
                    break;
                }

                if (isIncrease) {
                    digitsAmount.style.animation = 'none';
                    digitsPrice.style.animation = 'none';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber2 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber2 1.2s ease-in-out forwards';
                    image2.style.display = 'block';
                    image2.classList.add('reverse');
                    setTimeout(() => {
                        image2.classList.remove('reverse');
                        image2.style.display = 'none';
                    }, 800)
                }

                break;
            case "2":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber2 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber2 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber3 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber3 1.2s ease-in-out forwards';
                }

                azure.innerHTML = "130";
                aws.innerHTML = "136";
                image2.style.display = 'block';
                rangeEuro.style.left = '48px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 31px !important; } }";
                input.style.borderRadius = '4px';
                break;
            case "3":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber3 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber3 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber4 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber4 1.2s ease-in-out forwards';
                }

                azure.innerHTML = "260";
                aws.innerHTML = "272";
                image2.style.display = 'block';
                rangeEuro.style.left = '48px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 31px !important; } }";
                break;
            case "4":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber4 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber4 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber5 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber5 1.2s ease-in-out forwards';
                    image3.style.display = 'block';
                    image3.classList.add('reverse');
                    setTimeout(() => {
                        image3.classList.remove('reverse');
                        image3.style.display = 'none';
                    }, 800)
                }

                azure.innerHTML = "520";
                aws.innerHTML = "544";
                image2.style.display = 'block';
                rangeEuro.style.left = '17px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 9px !important; } }";
                break;
            case "5":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber5 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber5 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber6 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber6 1.2s ease-in-out forwards';
                }

                azure.innerHTML = "1,040";
                aws.innerHTML = "1,088";
                image2.style.display = 'block';
                image3.style.display = 'block';
                rangeEuro.style.left = '17px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 9px !important; } }";
                break;
            case "6":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber6 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber6 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber7 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber7 1.2s ease-in-out forwards';
                }

                azure.innerHTML = "2,080";
                aws.innerHTML = "2,176";
                image2.style.display = 'block';
                image3.style.display = 'block';
                rangeEuro.style.left = '10px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: 3px !important; } }";
                break;
            case "7":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber7 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber7 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber8 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber8 1.2s ease-in-out forwards';
                }

                azure.innerHTML = "4,160";
                aws.innerHTML = "4,352";
                image2.style.display = 'block';
                image3.style.display = 'block';
                rangeEuro.style.left = '-21px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: -20px !important; } }";
                break;
            case "8":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber8 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber8 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'rollingDecreaseNumber9 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingDecreaseNumber9 1.2s ease-in-out forwards';
                    image4.style.display = 'block';
                    image5.style.display = 'block';
                    image4.classList.add('reverse');
                    image5.classList.add('reverse');
                    setTimeout(() => {
                        image4.classList.remove('reverse');
                        image5.classList.remove('reverse');
                        image4.style.display = 'none';
                        image5.style.display = 'none';
                    }, 800)
                }

                azure.innerHTML = "8,320";
                aws.innerHTML = "8,704";
                image2.style.display = 'block';
                image3.style.display = 'block';
                rangeEuro.style.left = '-21px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: -20px !important; } }";
                input.style.borderRadius = '4px';
                break;
            case "9":
                if (isIncrease) {
                    digitsAmount.style.animation = 'rollingIncreaseNumber9 1.2s ease-in-out forwards';
                    digitsPrice.style.animation = 'rollingIncreaseNumber9 1.2s ease-in-out forwards';
                } else {
                    digitsAmount.style.animation = 'none';
                    digitsPrice.style.animation = 'none';
                }

                azure.innerHTML = "16,640";
                aws.innerHTML = "17,408";
                image2.style.display = 'block';
                image3.style.display = 'block';
                image4.style.display = 'block';
                image5.style.display = 'block';
                gigabyte.style.display = 'none';
                tbyte.style.display = 'inline-block';
                rangeEuro.style.left = '-21px';
                rangeEuro.style.transition = '0.5s all ease-in-out';
                numbersStyle.innerHTML = "@media (max-width: 559.98px) { .range__img-euro { left: -20px !important; } }";
                input.style.borderRadius = '20px 50px 50px 20px';
                break;
        }
    };
}

const rangeInput = new RangeInput();



window.addEventListener("load", function () {
    const shine = this.document.getElementById('button_shine');
    window.setTimeout(function () {
        shine.style.display = 'block';
    }, 8000);
})