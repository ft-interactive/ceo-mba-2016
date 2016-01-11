import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';
import marked from 'marked';
import mainTemplate from '../templates/main.hbs';
import cardTemplate from '../templates/ceo_card.hbs';

const content = marked(spreadsheet.methodology[0].content);

document.addEventListener('DOMContentLoaded', () => {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // YOUR CODE HERE!

  document.querySelector('main').innerHTML = mainTemplate(spreadsheet);
  document.querySelector('.bios').innerHTML = cardTemplate(spreadsheet.slides);

   // put the HTML from the spreadsheet (originally markdown) into the story div
  var methodology = document.querySelector('.methodology');
  methodology.innerHTML = content;

  var categories = spreadsheet.groups;

  var multiplier = spreadsheet.options.circleMultiplier;

  var svg = d3.select('.container').append('svg')
    .attr('width', '100%')
    .attr('preserveAspectRatio', 'xMinYMin meet')
		.attr('viewBox', '0 0 972 600')

		// class to make it responsive
		.classed('svg-content-responsive', true);

  var circleGroup = svg.selectAll('g')
    .data(categories)
    .enter()
    .append('g')
    .attr('class', function (d, i) { if (i === 0) {return 'category selected ' + d.slug;} return 'category ' + d.slug;});

  circleGroup.append('circle')
		.attr('cx', function (d) { return d.circlex; })
    .attr('cy', function (d) { return d.circley; })
    .attr('r', 0)
    .style({fill: function (d) { return d.fillcolor; }})
    .transition().delay(function (d, i) { return (i * 150) + 200; }).duration(1000).ease('elastic').attr('r', function (d) { return (Math.sqrt(Number(d.radius)) / Math.PI) * multiplier; });

  circleGroup
  	.append('image')
		.attr({'class': 'logo',
      'xlink:href': function (d) { if (d.logo) {return 'https://ig.ft.com/static/sites/2016/ceo-mba-2016/' + d.logo;}},
      'width': function (d) { return d.width; },
      'height': function (d) { return d.height; },
      'x': function (d) { return d.circlex - (d.width / 2); },
      'y': function (d) { return d.circley - (d.height / 2); },
      'opacity': 0
    })
    .transition().delay(function (d, i) { return (i * 150) + 200; }).duration(1000).ease('quad').attr('opacity', 1);

  circleGroup.append('text')
		.text(function (d) { return d.shortname; })
		.attr({'class': function (d) { if (!d.logo) {return 'labels always';} return 'labels'; },
  		'x': function (d) { return d.circlex; },
  		'y': function (d) { return d.circley + 10; },
  		'opacity': 0
		})
    .transition().delay(function (d, i) { return (i * 150) + 200; }).duration(1000).ease('quad').attr('opacity', 1);

  circleGroup
    .append('text')
		.text(function (d) { return d.radius; })
		.attr({'class': 'ceo-num',
  		'x': function (d) { return d.circlex; },
  		'y': function (d) { return d.circley + (Math.sqrt(Number(d.radius)) / Math.PI) * multiplier - 5;},
  		'opacity': 0
		})
    .transition().delay(function (d, i) { return (i * 150) + 200; }).duration(500).ease('quad').attr('opacity', 1);

  circleGroup
    .on('click', function () {
      d3.selectAll('.category').classed('selected', false);
      d3.select(this).classed('selected', true);
      d3.selectAll('.card-holder').classed('visible', false);
      var slug = d3.select(this)[0][0].__data__.slug;
      d3.selectAll('.' + slug).classed('visible', true);
      var uniName = d3.select(this)[0][0].__data__.name;
      d3.select('.uni-name').text(uniName);
      d3.selectAll('.uni-small').style('display', 'none');
      if (slug === 'one' || slug === 'two') {
        d3.selectAll('.' + slug + ' .uni-small').style('display', 'block');
      }
    });

  function setFirstView(slug) {
    d3.selectAll('.' + slug).classed('visible', true);
  }
  setFirstView('harvard');
});
